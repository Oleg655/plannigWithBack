import { DataTypes, Sequelize, Model, Association } from 'sequelize';

class Session extends Model {
	public origin: string;
	public cookie: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public static initModel(sequelize: Sequelize): void {
		Session.init(
			{
				origin: {
					type: DataTypes.STRING,
					primaryKey: true,
					allowNull: false,
					comment: 'Источник сессии',
				},
				cookie: {
					type: DataTypes.STRING,
					allowNull: false,
					comment: 'Куки сессии',
				},
			},
			{
				tableName: 'sessions',
				sequelize: sequelize,
			},
		);
	}
}

export default Session;
