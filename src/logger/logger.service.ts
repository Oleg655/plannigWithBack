import { injectable } from 'inversify';
import { ILogger } from './logger.interface';
import 'reflect-metadata';
import { get, Logger } from 'k-logger';

@injectable()
export class LoggerService implements ILogger {
	logger: Logger;

	constructor() {
		this.logger = get('base', {
			path: global.KServerApi.LogsPath,
			error: 'error.log',
			warning: 'warning.log',
			info: 'info.log',
		});
	}

	log(...args: unknown[]): void {
		this.logger.INFO(...args);
	}

	error(...args: unknown[]): void {
		this.logger.ERROR(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.WARNING(...args);
	}

	async close(): Promise<void> {
		await this.logger.close();
	}
}
