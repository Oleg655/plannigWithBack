import { DataTypes, Sequelize, Model, Association } from 'sequelize';

class Project extends Model {
	public id!: number;
	public ownerId!: number;
	public name!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public static initModel(sequelize: Sequelize): void {
		Project.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true,
					comment: 'Идентификатор',
				},
				ownerId: {
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false,
					comment: 'Владелец',
				},
				name: {
					type: new DataTypes.STRING(128),
					allowNull: false,
					comment: 'Название проекта',
				},
			},
			{
				tableName: 'projects',
				sequelize: sequelize,
			},
		);
	}

	public static associations: {};
}

export default Project;
