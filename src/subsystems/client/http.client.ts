import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { IClient } from './client.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { URL } from 'url';
import { CookiesService } from './cookies/cookies.servive';
import http from 'http';
import https from 'https';
import os from 'os';
import ntlm from 'axios-ntlm/lib/ntlm';
import { ISessionsService } from '../../services/sessions/sessions.servies.interface';

export enum SubsystemTypes {
	RDM = 1,
}

@injectable()
export class HttpClient implements IClient {
	public login: string;
	public path: string;
	private defaultUserAgent: string;
	private client: AxiosInstance;
	private password: string;
	private domain: string | undefined;
	private authorizationStorage: any = {};
	private tryConnect: number = 0;

	constructor(
		@inject(TYPES.ConfigService) private config: IConfigService,
		@inject(TYPES.SessionsService) private session: ISessionsService,
	) {
		const { version, build } = global.KServerApi.Info;
		this.defaultUserAgent = `kserver planning/${version}.${build}`;
		this.login = this.config.api.rdm.login;
		this.password = this.config.api.rdm.password;
		this.domain = this.config.api.rdm.domain;
	}

	async getClient(stype: SubsystemTypes): Promise<AxiosInstance> {
		await this.session.init();

		this.client = axios.create({
			headers: {
				'user-agent': this.defaultUserAgent,
			},
			maxRedirects: 0,
		});

		if (stype === SubsystemTypes.RDM) {
			this.getRdmSettings();
		}

		this.client.interceptors.request.use(this.interceptorsRequest.bind(this));
		this.client.interceptors.response.use(undefined, this.interceptorsResponse.bind(this));

		return this.client;
	}

	private getRdmSettings() {
		const protocol = this.config.api.rdm.secure ? 'https' : 'http';
		this.path = `${protocol}://${this.config.api.rdm.host}:${this.config.api.rdm.port}/rdm/api`;
		this.client.defaults.baseURL = this.path;
	}

	private interceptorsRequest(request: AxiosRequestConfig): AxiosRequestConfig {
		if (request.headers && request.headers.cookie) return request;
		if (!request.headers) request.headers = {};

		const { origin } = new URL(request.url as string, request.baseURL);
		const user = (this.domain ? `${this.domain}\\` : '') + `${this.login}@${origin}`;

		const sessionCookie = this.session.sessionStorage[origin];
		const authCookie = this.authorizationStorage[user];
		request.headers.cookie = sessionCookie || authCookie ? [sessionCookie, authCookie].join('; ') : '';

		return request;
	}

	private async interceptorsResponse(error: AxiosError): Promise<any> {
		const { response } = error;
		if (!response || this.tryConnect >= 5) {
			this.tryConnect = 0;
			throw error;
		}

		const { origin } = new URL(response.config.url as string, response.config.baseURL);
		const user = (this.domain ? `${this.domain}\\` : '') + `${this.login}@${origin}`;

		if (response.status === 307 && response.headers['set-cookie']) {
			const cookie = CookiesService.from(response.headers['set-cookie']).get();

			await this.session.saveSession(origin, cookie);
			CookiesService.attach(response.config.headers).merge(cookie);
			return this.client.request(response.config);
		}

		if (response.status === 403) {
			this.tryConnect += 1;
			const Auth = Buffer.from(`${this.login}:${this.password}`).toString('base64');

			CookiesService.attach(response.config.headers).merge({ Auth });

			const result = await this.client.request(response.config);

			this.authorizationStorage[user] = CookiesService.from({ Auth }).get();

			return result;
		}

		if (response.status === 401) {
			this.tryConnect += 1;
			const wwwAuthenticate = response.headers['www-authenticate'];

			if (wwwAuthenticate === 'NTLM') {
				response.config.httpAgent = new http.Agent({
					keepAlive: true,
					maxSockets: 1,
				});

				response.config.httpsAgent = new https.Agent({
					keepAlive: true,
					maxSockets: 1,
				});

				await axios.request({
					...response.config,
					validateStatus: status => status === 401,
				});

				const type1msg = ntlm.createType1Message(os.hostname(), this.domain);
				if (response.config.headers) {
					response.config.headers.authorization = type1msg;
				}

				return this.client.request(response.config);
			}

			if (wwwAuthenticate.startsWith('NTLM ') && response.config.headers) {
				const type3msg = ntlm.createType3Message(
					ntlm.decodeType2Message(response.headers['www-authenticate']),
					this.login,
					this.password,
					os.hostname(),
					this.domain,
				);
				response.config.headers.authorization = type3msg;

				const result = await axios.request(response.config);

				//TODO: нужно ли возвращать значения для response.config.httpAgent и response.config.httpsAgent?

				const KodeksA = CookiesService.from(result.headers['set-cookie']).get(true);
				this.authorizationStorage[user] = CookiesService.from(KodeksA).get();
				this.tryConnect = 0;

				if (result.config.headers) {
					delete result.config.headers.authorization;
				}
				CookiesService.attach(result.config.headers)
					.merge(this.session.sessionStorage[origin])
					.merge(this.authorizationStorage[user]);

				return result;
			}
		}

		throw error;
	}
}
