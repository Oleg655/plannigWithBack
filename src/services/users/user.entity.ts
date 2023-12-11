import User from '../../database/models/user';
import { validate as uuidValidate, NIL as NIL_UUID } from 'uuid';

export class UserEntity {
	login: string;
	name: string;
	email: string | null;
	id: number | null;
	rdmUID: string | null;
	roles: string[] = [];
	modules: string[] = [];
	isAdmin: boolean | null;

	constructor(id: number | string | null, login: string, name: string, email: string | null) {
		if (typeof id === 'string') {
			this.rdmUID = uuidValidate(id) ? id : NIL_UUID;
		}
		else {
			this.id = id;
		}
		this.login = login;
		this.name = name;
		this.email = email;
	}

	static getUserFromModel(user: User): UserEntity {
		return new UserEntity(user.id, user.login, user.name, user.email);
	}

	static mergeUser(target: UserEntity, source: UserEntity): UserEntity {
		target.id = target.id ?? source.id;
		target.rdmUID = target.rdmUID ?? source.rdmUID;
		target.login = target.login ?? source.login;
		target.name = target.name ?? source.name;
		target.email = target.email ?? source.email;
		return target;
	}
}
