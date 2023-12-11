import { DataTypes, Sequelize, Model, Association } from 'sequelize';
import Project from './project';

class User extends Model {
	public id!: number;
	public login!: string;
	public email!: string | null;
	public name!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public static initModel(sequelize: Sequelize): void {
		User.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true,
					comment: 'Идентификатор',
				},
				login: {
					type: DataTypes.STRING,
					unique: true,
					allowNull: false,
					comment: 'Логин',
				},
				email: {
					type: DataTypes.STRING(128),
					validate: { isEmail: true },
					set(this: User, value: string) {
						this.setDataValue('email', value !== '' ? value : null);
					},
					comment: 'Email',
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
					comment: 'Наименование',
				},
			},
			{
				tableName: 'users',
				sequelize: sequelize,
			},
		);
	}

	public readonly projects?: Project[];

	public static associations: {
		projects: Association<User, Project>;
	};

	public static associateModel(sequelize: Sequelize) {
		this.hasMany(Project, {
			as: 'projects',
			foreignKey: 'ownerId',
			sourceKey: 'id',
		});
	}
}

export default User;
