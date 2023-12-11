import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-errors.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.LoggerService) private logger: ILogger) {}
	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`Ошибка ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ title: err.title, message: err.message, statusCode: err.statusCode });
		} else {
			this.logger.error(err);
			res.status(500).send({ err: err.message });
		}
	}
}
