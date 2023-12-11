import { inject, injectable } from 'inversify';
import {
	IApiSettings,
	IConfigService,
	IDatabaseSettings,
	IGeneralSettings,
	ISessionSettings,
} from './config.service.interface';
import fs from 'fs';
import path from 'path';
import { AppError } from '../error/app-errors.class';

@injectable()
export class ConfigService implements IConfigService {
	public general: IGeneralSettings;
	public database: IDatabaseSettings;
	public session: ISessionSettings;
	public preferredVDir: string = '';
	public api: { rdm: IApiSettings };
	public configPath: string;

	constructor() {
		this.configPath = path.join(global.KServerApi.StoragePath, 'config.json');
		let config: any;

		try {
			if (fs.existsSync(this.configPath)) {
				config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
			} else {
				config = this.createDefaultConfig();
			}
		} catch (e) {
			if (e instanceof Error) {
				throw new AppError(
					'ConfigError.ErrorReadingConfigFile',
					e.message,
					'Не смог прочитать/создать файл конфигурации. Возможно у вас недостачно прав для выполнения этого действия.',
					`Путь к файлу: ${this.configPath}.`,
				);
			}
			throw e;
		}

		try {
			this.general = {
				salt: config.general.salt,
				secretkey: config.general.secretkey,
				env: process.env.PLN_ENV || config.general.env,
			};
			this.database = {
				type: process.env.PLN_DB_TYPE || config.database.type,
				name: process.env.PLN_DATABASE_NAME || config.database.name,
				host: process.env.PLN_DATABASE_HOST || config.database.host,
				port: process.env.PLN_DATABASE_PORT || config.database.port,
				username: process.env.PLN_DATABASE_USERNAME || config.database.username,
				password: process.env.PLN_DATABASE_PASSWORD || config.database.password,
			};
			this.session = {
				secretkey: config.session.secretkey,
				timeout: config.session.timeout,
			};
			this.api = {
				rdm: {
					host: config.api.rdm.host,
					port: config.api.rdm.port,
					secure: config.api.rdm.secure,
					login: config.api.rdm.login,
					password: config.api.rdm.password,
					domain: config.api.rdm.domain ? config.api.rdm.domain : undefined,
				},
			};
		} catch (e) {
			if (e instanceof Error) {
				throw new AppError(
					'ConfigError.ErrorParsingConfigFile',
					e.message,
					'"Файл конфигурации config.json имеет некорректный синтаксис. Пожалуйста, заполните необходимые параметры в соответствии с форматом JSON.',
					`Путь к файлу: ${this.configPath}.`,
				);
			}
			throw e;
		}
	}

	private createDefaultConfig() {
		const config = {
			general: {
				salt: 10,
				secretkey: 'MYAPP',
				env: 'production',
			},
			database: {
				type: 'sqlite',
				name: 'planning',
				host: 'localhost',
				port: '5432',
				username: 'kodeks',
				password: 'kodeks',
			},
			session: {
				secretkey: 'm$kf3nWgtz<9',
				timeout: 900000,
			},
			api: {
				rdm: {
					host: '127.0.0.1',
					port: 5000,
					secure: false,
					login: 'kodeks',
					password: 'kodeks',
				},
			},
		};

		const json = JSON.stringify(config, null, '\t');
		fs.writeFileSync(this.configPath, json, 'utf8');
		return config;
	}

	async init(): Promise<void> {
		while (this.preferredVDir === '') {
			global.KServerApi.GetServerInfo().then(info => {
				this.preferredVDir = info.PreferredVDir;
			});
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	}
}
