import { injectable, inject } from 'inversify';
import { BaseController } from '../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { ICoreController } from './core.controller.interface';
import { App } from '../../app';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';

@injectable()
export class CoreController extends BaseController implements ICoreController {
	app: App;
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {
		super();
		this.bindRoute([
			{
				path: '/close',
				method: 'post',
				func: this.close,
			},
			{
				path: '/getServerInfo',
				method: 'get',
				func: this.getServerInfo,
			},
		]);
	}

	async getServerInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			this.ok(res, await global.KServerApi.GetServerInfo());
		} catch (err) {
			next(err);
		}
	}

	close(req: Request, res: Response, next: NextFunction): void {
		if (this.configService.general.env === 'development') {
			this.ok(res, { message: 'Завершаю работу.' });
			setTimeout(() => {
				this.app.close();
			}, 1000);
		} else {
			this.ok(res, { message: 'Требуется включить режим DEBUG.' });
		}
	}
}
