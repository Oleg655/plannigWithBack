import Session from '../../database/models/session';
import { SessionEntity } from './sessions.entity';

export interface ISessionRepository {
	saveSession(session: SessionEntity): Promise<boolean>;
	findAllSession(): Promise<Session[]>;
}
