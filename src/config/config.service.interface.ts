declare interface IGeneralSettings {
	salt: number;
	secretkey: string;
	env: string;
}

declare interface IDatabaseSettings {
	type: string;
	name: string;
	host: string;
	port: number;
	username: string;
	password: string;
}

declare interface ISessionSettings {
	secretkey: string;
	timeout: number;
}

declare interface IApiSettings {
	host: string;
	port: number;
	login: string;
	password: string;
	secure: boolean;
	domain?: string;
}

interface IConfigService {
	preferredVDir: string;
	general: IGeneralSettings;
	database: IDatabaseSettings;
	session: ISessionSettings;
	api: { rdm: IApiSettings };
	init(): Promise<void>;
}

export { IConfigService, IGeneralSettings, IDatabaseSettings, ISessionSettings, IApiSettings };
