import { CookiesService } from './cookies.servive';

export interface ICookiesService {
	merge(source: any): CookiesService;
	get(decoded: boolean): string;
}
