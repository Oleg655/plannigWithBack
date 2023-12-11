import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { Sequelize, ConnectionError as SequelizeConnectionError } from 'sequelize';
import { SequelizeService } from './sequelize.absclass';
import { ConfigService } from '../config/config.service';
import { AppError } from '../error/app-errors.class';

@injectable()
export class PostgresService extends SequelizeService {
	constructor(@inject(TYPES.LoggerService) logger: ILogger, @inject(TYPES.ConfigService) config: ConfigService) {
		super(logger, config);

		this.dbConfig.dialect = 'postgres';

		this.dbConfig.host = config.database.host;
		this.dbConfig.port = config.database.port;
		this.dbConfig.database = config.database.name;
		this.dbConfig.username = config.database.username;
		this.dbConfig.password = config.database.password;

		this.dbConfig.timezone = this.getTimezone();
	}

	async testConnection(): Promise<void> {
		try {
			await this.connection.authenticate().catch(async (err: any) => {
				if (!err.original || err.original.code !== '3D000') {
					throw err;
				}
				// specified database was not found
				const adminConnection = new Sequelize({
					...this.dbConfig,
					database: 'postgres',
				});
				try {
					await adminConnection.query(`CREATE DATABASE ${this.connection.config.database}`);
					await this.connection.authenticate();
				} catch (err) {
					throw err;
				} finally {
					await adminConnection.close();
				}
			});
			this.logger.log('DB connection successful');
		} catch (err) {
			if (err instanceof SequelizeConnectionError || err instanceof RangeError) {
				throw new AppError(
					'PostgresService.TestConnectionError',
					err.message,
					'Невозможно подключиться к базе данных Postgres.',
					`Убедитесь что хост ${this.dbConfig.host}:${this.dbConfig.port} доступен, в кофигурационном файле указан правильный пароль для пользователя ${this.dbConfig.username}, и у этого пользователя есть права на базу данных ${this.dbConfig.database}.`,
				);
			}

			throw err;
		}
	}

	async prepareDataBase(): Promise<void> {}

	private getTimezone(): string {
		const offset = new Date().getTimezoneOffset();
		const sign = offset <= 0 ? '+' : '-';
		const hours = Math.abs(Math.floor(offset / 60));
		const minutes = Math.abs(offset % 60);
		return `${sign}${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
	}
}
