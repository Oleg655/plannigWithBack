import 'core-js/es/array';
import { Container, ContainerModule, interfaces } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
const appContainer = new Container();
export const { lazyInject } = getDecorators(appContainer);
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });
import { App } from './app';
import { TYPES } from './types';
import { IExceptionFilter } from './error/exception.filter.interface';
import { ExceptionFilter } from './error/exception.filter';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { CoreController } from './services/core/core.controller';
import { ICoreController } from './services/core/core.controller.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { IUserService } from './services/users/users.service.interface';
import { IUserController } from './services/users/users.controller.interface';
import { UserService } from './services/users/users.service';
import { UserController } from './services/users/users.controller';
import { PostgresService } from './database/postgres.service';
import { SequelizeService } from './database/sequelize.absclass';
import { SqliteService } from './database/sqlite.service';
import { IUsersRepository } from './services/users/users.repository.interface';
import { UserRepository } from './services/users/users.repository';
import { IClient } from './subsystems/client/client.interface';
import { HttpClient } from './subsystems/client/http.client';
import { IRdmService } from './subsystems/rdm/rdm.service.interface';
import { RdmSystem } from './subsystems/rdm/rdm.service';
import { SessionRepository } from './services/sessions/sessions.repository';
import { ISessionRepository } from './services/sessions/sessions.repository.interface';
import { SessionsService } from './services/sessions/sessions.service';
import { ISessionsService } from './services/sessions/sessions.servies.interface';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<ICoreController>(TYPES.CoreController)
		.to(CoreController)
		.inSingletonScope();
	bind<ILogger>(TYPES.LoggerService)
		.to(LoggerService)
		.inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService)
		.to(ConfigService)
		.inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IUsersRepository>(TYPES.UserRepository).to(UserRepository);
	bind<ISessionsService>(TYPES.SessionsService).to(SessionsService);
	bind<ISessionRepository>(TYPES.SessionRepository).to(SessionRepository);
	bind<IClient>(TYPES.HttpClient).to(HttpClient);
	bind<IRdmService>(TYPES.RdmService).to(RdmSystem);
});

async function bootstrap(): Promise<App | null> {
	//await new Promise(resolve => setTimeout(resolve, 5000)); // wait 2 seconds if needed debug
	appContainer.load(appBindings);

	try {
		const config = appContainer.get<ConfigService>(TYPES.ConfigService);
		if (config.database.type === 'postgres') {
			appContainer
				.bind<SequelizeService>(TYPES.SequelizeService)
				.to(PostgresService)
				.inSingletonScope();
		} else {
			appContainer
				.bind<SequelizeService>(TYPES.SequelizeService)
				.to(SqliteService)
				.inSingletonScope();
		}

		const app = appContainer.get<App>(TYPES.Application);
		await app.init();
		const core = appContainer.get<CoreController>(TYPES.CoreController);
		core.app = app;

		return app;
	} catch (err) {
		console.log(err);
	}
	return null;
}

export const boot = bootstrap();
