import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import * as bodyParser from 'body-parser';
import { IExceptionFilter } from './error/exception.filter.interface';
import { IConfigService } from './config/config.service.interface';
import { ICoreController } from './services/core/core.controller.interface';
import { ILogger } from './logger/logger.interface';
import { IUserController } from './services/users/users.controller.interface';
import { SequelizeService } from './database/sequelize.absclass';
import session from 'express-session';
import CreateMemoryStore from 'memorystore';
import { AuthMiddleware } from './services/common/auth.middleware';
import path from 'path';
import { IUserService } from './services/users/users.service.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	socketPath: string;
	pluginRoute: string;
	publicPath: string;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.ConfigService) private config: IConfigService,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.SequelizeService) private sequelize: SequelizeService,
		@inject(TYPES.CoreController) private coreController: ICoreController,
		@inject(TYPES.UserController) private userController: IUserController,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		//TODO: пробегись по коду, найди места где могут быть ошибки, добавить try catch
		this.socketPath = global.KServerApi.SocketPath;
		this.pluginRoute = global.KServerApi.Route;
		this.app = express();
		this.publicPath = path.join(__dirname, '../client/build');
	}

	useMiddleware(): void {
		//TODO: нужна ли проверка на устаревший браузер?
		this.app.use(`/${this.pluginRoute}/`, express.static(this.publicPath));

		this.app.use(bodyParser.json({ limit: '100mb' }));
		this.app.use(
			bodyParser.urlencoded({
				extended: true,
				limit: '100mb',
				parameterLimit: 1000000,
			}),
		);

		const MemoryStore = CreateMemoryStore(session);
		this.app.use(
			session({
				resave: false,
				saveUninitialized: false,
				secret: this.config.session.secretkey,
				cookie: {
					maxAge: this.config.session.timeout,
				},
				store: new MemoryStore({
					checkPeriod: this.config.session.timeout,
				}) as any,
			}),
		);

		const authMiddleware = new AuthMiddleware(this.userService);
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use(`/${this.pluginRoute}/api`, this.userController.router);
		this.app.use(`/${this.pluginRoute}/core`, this.coreController.router);
		this.app.use(`/${this.pluginRoute}/`, express.static(path.join(__dirname, '../client/build'), {}));
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	async init(): Promise<void> {
		await this.sequelize.connect();
		await this.config.init();
		await this.userService.init();
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(this.socketPath, () => {
			this.logger.log(
				`Подсистема Планирования нормативных документов (PLANNING) запущена на порт: ${this.socketPath}.`,
			);
		});
	}

	close(): void {
		//TODO: учесть в global.onShutdown
		this.sequelize.disconnect();
		this.server.close();
		this.logger.close();
		process.exit(0);
	}
}
