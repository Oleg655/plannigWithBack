import { inject, injectable } from 'inversify';
import { IUserService } from './users.service.interface';
import User from '../../database/models/user';
import { UserRegisterDto } from './dto/register-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { TYPES } from '../../types';
import { IUsersRepository } from './users.repository.interface';
import { IRdmService } from '../../subsystems/rdm/rdm.service.interface';
import axios from 'axios';
import { Request } from 'express';
import { AccessError, AuthorizationError, ConnectionError, HTTPError } from '../../error/http-errors.class';

@injectable()
export class UserService implements IUserService {
	private license = 333111000;
	constructor(
		@inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.RdmService) private rdmApi: IRdmService,
	) {}

	async getInfoUser(req: Request): Promise<UserEntity | null> {
		if (req.session && req.session.user) {
			return req.session.user;
		}

		const userKserver = await this.getUserInfoKserver(req);
		if (userKserver) {
			const user = await this.findByLoginUser(userKserver.login);
			if (user) {
				//TODO: CheckAccess забирает лицензию, поэтому её нужно делать в самом конце, после проверки ролей пользователя (см.ниже)
				const access = await global.KServerApi.CheckAccess(this.license, req);
				if (!access.granted) {
					throw new AccessError(access.reason ?? 'Что-то пошло не так.');
				}

				req.session.user = UserEntity.mergeUser(user, userKserver);
				req.session.user.isAdmin = await this.checkAdminRole(req);
				//TODO: добавь проверку хотя бы одной роли пользователя
				return req.session.user;
			} else {
				throw new AccessError(`Логин "${userKserver.login}" пользователя не найден в структуре НСИ.`);
			}
		}

		return null;
	}

	private async findByLoginUser(login: string): Promise<UserEntity | null> {
		try {
			const rdmEmp = await this.rdmApi.getEmps({ adlogin: { iequal: login } }, ['UID', 'fullName', 'email']);
			if (rdmEmp) {
				return new UserEntity(rdmEmp[0].UID, login, rdmEmp[0].fullName, rdmEmp[0].email);
			}
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const url = this.rdmApi.clientHttp.path;
				if (!err.response || err.response.status === 404) {
					throw new ConnectionError(`Не удается подключиться к ${url}, убедитесь, что он доступен.`);
				}
				if (err.response?.status === 403 || err.response?.status === 401) {
					const catalog = url ? url.replace(/.+\/(.+?)$/, '$1') : '';
					const user = this.rdmApi.clientHttp.login;
					throw new AuthorizationError(
						`Не удается авторизоваться на ${url}. Убедитесь, что пользователь ${user} существует, у этого пользователя есть права на каталог ${catalog} и в конфигурационном файле задан правильный пароль.`,
					);
				}
				throw new HTTPError(err.message);
			}
		}
		return null;
	}

	private async getUserInfoKserver(req: Request): Promise<UserEntity | null> {
		try {
			const userInfo = await global.KServerApi.UserInfo(req);

			if (!userInfo.authenticated) {
				throw new AccessError(
					'Доступ без авторизации запрещен. Необходимо проведение технологических работ по настройке авторизации и прав доступа.',
				);
			}

			if (userInfo) {
				return new UserEntity(userInfo.id, userInfo.login, userInfo.name, userInfo.email);
			}
		} catch (err) {
			if (err instanceof Error) {
				throw new HTTPError(err.message);
			}
		}
		return null;
	}

	private async checkAdminRole(req: Request): Promise<boolean> {
		//TODO: замени ond_admin на администратора планирования
		return (await global.KServerApi.PickPermissions(['ond_admin'], req))[0].granted || false;
	}

	async createUser({ login, email, name }: UserRegisterDto): Promise<User | null> {
		const newUser = new UserEntity(null, login, name, email);
		return this.usersRepository.createUser(newUser);
	}
	async updateUser(dto: UserUpdateDto): Promise<number> {
		const newUser = new UserEntity(dto.id, dto.login, dto.name, dto.email);
		return await this.usersRepository.updateUser(newUser);
	}
	async deleteUser(id: number): Promise<number> {
		return await this.usersRepository.deleteUser(id);
	}
	async findByIdUser(id: number): Promise<User | null> {
		return await this.usersRepository.findByIdUser(id);
	}
	async findAllUsers(): Promise<User[]> {
		return await this.usersRepository.findAllUsers();
	}
	async init(): Promise<void> {
		await this.rdmApi.init();
	}
}
