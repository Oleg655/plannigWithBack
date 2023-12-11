import User from '../../database/models/user';
import { UserEntity } from './user.entity';

export interface IUsersRepository {
	createUser(user: UserEntity): Promise<User>;
	updateUser(user: UserEntity): Promise<number>;
	deleteUser(id: number): Promise<number>;
	findByIdUser(id: number): Promise<User>;
	findByLoginUser(login: string): Promise<User>;
	findAllUsers(): Promise<User[]>;
}
