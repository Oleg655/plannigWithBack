import User from '../../database/models/user';
import { UserRegisterDto } from './dto/register-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { Request } from 'express';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<User | null>;
	updateUser: (dto: UserUpdateDto) => Promise<number>;
	deleteUser: (id: number) => Promise<number>;
	findByIdUser: (id: number) => Promise<User | null>;
	findAllUsers: () => Promise<User[]>;
	getInfoUser: (req: Request) => Promise<UserEntity | null>;
	init(): Promise<void>;
}
