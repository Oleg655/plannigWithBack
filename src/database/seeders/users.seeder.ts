import { Sequelize } from 'sequelize';
import User from '../models/user';

module.exports = async (connection: Sequelize) => {
	await User.findOrCreate({
		where: { name: 'SuperUser', login: 'superuser' },
	});

	await User.findOrCreate({
		where: { name: 'Visitor', login: 'visitor' },
	});

	await User.findOrCreate({
		where: { name: 'Admin', login: 'admin' },
	});

	await User.findOrCreate({
		where: { name: 'Mikhail', login: 'mikhail' },
	});

	await User.findOrCreate({
		where: { name: 'Anna', login: 'anna' },
	});

	await User.findOrCreate({
		where: { name: 'Vasily', login: 'vasily' },
	});

	await User.findOrCreate({
		where: { name: 'Oleg', login: 'oleg' },
	});
};
