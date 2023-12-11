import { Sequelize } from 'sequelize';

module.exports = async (connection: Sequelize) => {
	await require('./users.seeder')(connection);
	await require('./projects.seeder')(connection);
};
