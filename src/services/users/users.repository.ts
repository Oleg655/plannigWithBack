import { inject, injectable } from 'inversify';
import { SequelizeService } from '../../database/sequelize.absclass';
import { TYPES } from '../../types';
import { IUsersRepository } from './users.repository.interface';
import User from '../../database/models/user';
import { UserEntity } from './user.entity';

@injectable()
export class UserRepository implements IUsersRepository {
	constructor(@inject(TYPES.SequelizeService) private sequelizeService: SequelizeService) {}
	async createUser(user: UserEntity): Promise<User> {
		return (await this.sequelizeService.connection.models.User.create({
			name: user.name,
			email: user.email,
			login: user.login,
		})) as User;
	}
	async updateUser(user: UserEntity): Promise<number> {
		return (
			await this.sequelizeService.connection.models.User.update(
				{
					name: user.name,
					email: user.email,
					login: user.login,
				},
				{
					where: {
						id: user.id,
					},
				},
			)
		)[0];
	}
	async deleteUser(id: number): Promise<number> {
		return await this.sequelizeService.connection.models.User.destroy({
			where: {
				id: id,
			},
		});
	}
	async findByIdUser(id: number): Promise<User> {
		return (await this.sequelizeService.connection.models.User.findOne({
			where: {
				id: id,
			},
		})) as User;
	}
	async findByLoginUser(login: string): Promise<User> {
		return (await this.sequelizeService.connection.models.User.findOne({
			where: {
				login: login,
			},
		})) as User;
	}
	async findAllUsers(): Promise<User[]> {
		return (await this.sequelizeService.connection.models.User.findAll()) as User[];
	}
}
