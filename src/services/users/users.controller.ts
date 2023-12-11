import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import { HTTPError } from '../../error/http-errors.class';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/login-user.dto';
import { UserRegisterDto } from './dto/register-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { IUserService } from './users.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.LoggerService) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super();
		this.bindRoute([
			{
				path: '/findByIdUser',
				method: 'post',
				func: this.findByIdUser,
				middleware: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/createUser',
				method: 'post',
				func: this.createUser,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/updateUser',
				method: 'post',
				func: this.updateUser,
				middleware: [new ValidateMiddleware(UserUpdateDto)],
			},
			{
				path: '/deleteUser',
				method: 'post',
				func: this.deleteUser,
				middleware: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/findAllUsers',
				method: 'get',
				func: this.findAllUsers,
			},
			{
				path: '/getUserInfo',
				method: 'get',
				func: this.getUserInfo,
			},
		]);
	}

	async getUserInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			this.ok(res, await this.userService.getInfoUser(req));
		} catch (err) {
			next(err);
		}
	}

	async findByIdUser({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.userService.findByIdUser(body.id);
			if (!result) {
				return next(new HTTPError('Ошибка авторизации'));
			}

			this.ok(res, { email: result.email, id: result.id });
		} catch (err) {
			next(err);
		}
	}

	async findAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.userService.findAllUsers();
			this.ok(res, { result });
		} catch (err) {
			next(err);
		}
	}

	async createUser({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.userService.createUser(body);
			if (!result) {
				return next(new HTTPError('Пользователь с таким логином уже существует'));
			}

			this.ok(res, { email: result.email, id: result.id });
		} catch (err) {
			next(err);
		}
	}

	async updateUser({ body }: Request<{}, {}, UserUpdateDto>, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.userService.updateUser(body);

			if (!result) {
				return next(new HTTPError('Пользователь не найден'));
			}

			this.ok(res, { result });
		} catch (err) {
			next(err);
		}
	}

	async deleteUser({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.userService.deleteUser(body.id);

			if (!result) {
				return next(new HTTPError('Ошибка при удалении'));
			}

			this.ok(res, {});
		} catch (err) {
			next(err);
		}
	}
}
