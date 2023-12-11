import { lazyInject } from '../main';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

export class AppError extends Error {
	type: string;
	message: string;
	detail?: string;
	extendedInfo?: string;

	@lazyInject(TYPES.LoggerService)
	private logger: ILogger;

	constructor(type: string, message: string, detail?: string, extendedInfo?: string) {
		super(message);
		this.type = type;
		this.message = message;
		this.detail = detail;
		this.extendedInfo = extendedInfo;
		this.logger.error(
			`${type}: ${message}` +
				(detail ? `\ndetail: ${detail}` : '') +
				(extendedInfo ? `\nextendedInfo: ${extendedInfo}` : ''),
		);
	}
}
