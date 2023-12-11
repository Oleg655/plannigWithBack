import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { SequelizeService } from '../../database/sequelize.absclass';
import { SessionEntity } from './sessions.entity';
import Session from '../../database/models/session';
import { ISessionRepository } from './sessions.repository.interface';

@injectable()
export class SessionRepository implements ISessionRepository {
	constructor(@inject(TYPES.SequelizeService) private sequelizeService: SequelizeService) {}

	async saveSession(session: SessionEntity): Promise<boolean> {
		return await this.sequelizeService.connection.models.Session.upsert({
			origin: session.origin,
			cookie: session.cookie,
		});
	}

	async findAllSession(): Promise<Session[]> {
		return (await this.sequelizeService.connection.models.Session.findAll({ raw: true })) as Session[];
	}
}
