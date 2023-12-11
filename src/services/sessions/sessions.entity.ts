import Session from '../../database/models/session';

export class SessionEntity {
	private _origin: string;
	private _cookie: string;

	constructor(origin: string, cookie: string) {
		this._origin = origin;
		this._cookie = cookie;
	}

	get origin(): string {
		return this._origin;
	}

	get cookie(): string {
		return this._cookie;
	}
}
