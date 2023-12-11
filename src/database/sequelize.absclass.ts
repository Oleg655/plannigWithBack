import { Options, Sequelize } from 'sequelize';
import { ILogger } from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import fs from 'fs';
import path from 'path';
import { ConfigService } from '../config/config.service';

@injectable()
export abstract class SequelizeService {
	connection: Sequelize;
	dbConfig: Options;
	logger: ILogger;
	config: ConfigService;

	constructor(@inject(TYPES.LoggerService) logger: ILogger, @inject(TYPES.ConfigService) _config: ConfigService) {
		this.logger = logger;
		this.config = _config;
		this.dbConfig = {
			pool: {
				idle: 1000 * 30,
			},
			logging: msg => logger.log(msg),
		};
	}

	async connect(): Promise<void> {
		this.connection = new Sequelize(this.dbConfig);
		await this.testConnection();
		await this.prepareDataBase();
		this.prepareModels();
		if (this.config.general.env === 'development') {
			//TODO: некоторые справочники нужно заполнять автоматически в случае необходимости. Нужно это предусмотреть в коде.
			await this.connection.sync({ force: true });
			await this.seedersModels();
		} else {
			await this.connection.sync();
		}

		//TODO: настроить миграцию (umzug)
		//TODO: обработка ошибок взаимоблокировок
	}

	prepareModels(): void {
		const db: any = {};
		const pathToModels = path.join(__dirname, 'models');
		fs.readdirSync(pathToModels)
			.filter((file: string) => {
				return file.indexOf('.') !== 0 && file !== path.basename(__filename) && file.slice(-3) === '.js';
			})
			.forEach((file: any) => {
				const model = require(path.join(pathToModels, file)).default;
				model.initModel(this.connection);
				db[model.name] = model;
			});

		Object.keys(db).forEach(function(modelName) {
			if (db[modelName].associateModel) {
				db[modelName].associateModel();
			}
		});
	}

	async seedersModels(): Promise<void> {
		await require('./seeders/seeders.service')(this.connection);
	}

	async disconnect(): Promise<void> {
		await this.connection.close();
	}

	abstract prepareDataBase(): Promise<void>;
	abstract testConnection(): Promise<void>;
}
