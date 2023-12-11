import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import path from 'path';
import { SequelizeService } from './sequelize.absclass';
import { ConfigService } from '../config/config.service';
import { ConnectionError } from '../error/http-errors.class';

@injectable()
export class SqliteService extends SequelizeService {
	constructor(@inject(TYPES.LoggerService) logger: ILogger, @inject(TYPES.ConfigService) config: ConfigService) {
		super(logger, config);

		this.dbConfig.dialectOptions = { multipleStatements: true };
		this.dbConfig.retry = {
			max: 10,
			match: ['SQLITE_BUSY', 'SQLITE_LOCKED'],
		};
		this.dbConfig.dialectModule = require('node_sqlite');
		this.dbConfig.dialect = 'sqlite';
		this.dbConfig.storage = path.join(global.KServerApi.StoragePath, config.database.name + '.sqlite');
	}

	async testConnection(): Promise<void> {
		try {
			await this.connection.authenticate();
			this.logger.log('DB connection successful');
		} catch (err) {
			if (err instanceof Error) {
				throw new ConnectionError(err.message);
			}
			throw err;
		}
	}

	async prepareDataBase(): Promise<void> {
		const isFkSupportEnabled: any = await this.connection.query('PRAGMA foreign_keys');

		if (isFkSupportEnabled[0].foreign_keys === 0) {
			await this.connection.query('PRAGMA foreign_keys = ON');
			this.logger.log('FK rules support was successfully enabled');
		} else {
			this.logger.log('FK rules support is enabled');
		}
	}
}
