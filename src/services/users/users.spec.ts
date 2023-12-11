import 'reflect-metadata';
import { Container } from 'inversify';
import { ILogger } from '../../logger/logger.interface';
import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../../types';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';
import { HTTPError } from '../../error/http-errors.class';

const LoggerServiceMock: ILogger = {
	log: jest.fn(),
	error: jest.fn(),
	warn: jest.fn(),
	close: jest.fn(),
	logger: jest.fn(),
};

// const ConfigServiceMock: IConfigService = {
// 	get: jest.fn(),
// };

// const container = new Container();
// let logger: ILogger;
// let config: IConfigService;
// let userService: UserService;

// beforeAll(() => {
// 	container.bind<ILogger>(TYPES.LoggerService).toConstantValue(LoggerServiceMock);
// 	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
// 	container.bind<IUserService>(TYPES.UserService).to(UserService);

// 	logger = container.get<ILogger>(TYPES.LoggerService);
// 	config = container.get<IConfigService>(TYPES.ConfigService);
// 	userService = container.get<IUserService>(TYPES.UserService);
// });

// describe('Users', () => {
// 	it('sum', () => {
// 		const sum = userService.sum;
// 		expect(sum(1, 2)).toBe(3);
// 		expect(sum('10', '20')).toBe(30);
// 		expect(() => sum(undefined, '20')).toThrow(HTTPError);
// 		expect(() => sum('ddd', '20')).toThrow(HTTPError);
// 	});
// });
