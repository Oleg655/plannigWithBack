import { AccessError } from '../../error/http-errors.class';
import { IUserService } from '../users/users.service.interface';
import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';

export class AuthMiddleware implements IMiddleware {
	constructor(private user: IUserService) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userInfo = await this.user.getInfoUser(req);
			req.user = userInfo;
		} catch (error) {
			return next(error);
		}

		next();
	}
}
