export interface ISessionsService {
	sessionStorage: any;
	saveSession(origin: string, cookie: string): Promise<void>;
	init(): Promise<void>;
}
