import { inject, injectable } from 'inversify';
import { ISessionsService } from './sessions.servies.interface';
import { TYPES } from '../../types';
import { ISessionRepository } from './sessions.repository.interface';
import { SessionEntity } from './sessions.entity';

@injectable()
export class SessionsService implements ISessionsService {
	sessionStorage: any = {};

	constructor(@inject(TYPES.SessionRepository) private sessionRepository: ISessionRepository) {}

	async saveSession(origin: string, cookie: string): Promise<void> {
		const newSession = new SessionEntity(origin, cookie);
		await this.sessionRepository.saveSession(newSession);
		this.sessionStorage[origin] = cookie;
	}

	async init() {
		const sessions = await this.findAll();

		for (const session of sessions) {
			sessionStorage[session.origin] = session.cookie;
		}
	}

	private async findAll() {
		return await this.sessionRepository.findAllSession();
	}
}
