import { ICookiesService } from './cookies.service.interface';
import { AxiosRequestHeaders } from 'axios';

export class CookiesService implements ICookiesService {
	private static availableKeys: string[] = ['Kodeks', 'KodeksData', 'Auth', 'KodeksA'];
	private data: any;
	private headers: AxiosRequestHeaders | undefined;

	constructor() {}

	static decode(source: any): any {
		if (!source) return {};

		const decodedResult: any = {};

		if (typeof source === 'string') source = source.split('; ');
		if (!Array.isArray(source)) return source;

		for (const item of source) {
			const [payload] = item.split(';');
			const [key, ...restValue] = payload.split('=');

			if (!this.availableKeys.includes(key)) continue;

			const value = restValue.join('=');
			decodedResult[key] = value;
		}

		return decodedResult;
	}

	static encode(source: any): string {
		return Object.entries(source)
			.map(entry => entry.join('='))
			.join('; ');
	}

	static from(source: any): CookiesService {
		const cookie = new CookiesService();
		cookie.data = this.decode(source);
		return cookie;
	}

	static attach(headers: AxiosRequestHeaders | undefined): CookiesService {
		const cookie = new CookiesService();
		cookie.headers = headers;
		if (headers) cookie.data = CookiesService.decode(headers.cookie);
		return cookie;
	}

	merge(source: any): CookiesService {
		Object.assign(this.data, CookiesService.decode(source));
		if (this.headers) this.headers.cookie = CookiesService.encode(this.data);
		return this;
	}

	get(decoded = false): string {
		return decoded ? { ...this.data } : CookiesService.encode(this.data);
	}
}
