import { Sequelize } from 'sequelize';
import Project from '../models/project';

module.exports = async (connection: Sequelize) => {
	await Project.findOrCreate({
		where: { ownerId: 1, name: 'Зажигательное шоу' },
	});

	await Project.findOrCreate({
		where: { ownerId: 2, name: 'Дискотека 90-х' },
	});

	await Project.findOrCreate({
		where: { ownerId: 2, name: 'Самая скучная дискотека' },
	});

	await Project.findOrCreate({
		where: { ownerId: 3, name: 'Вечеринка пьяниц' },
	});

	await Project.findOrCreate({
		where: { ownerId: 4, name: 'Выставка живописи' },
	});

	await Project.findOrCreate({
		where: { ownerId: 4, name: 'У Миши больше всех мероприятий' },
	});

	await Project.findOrCreate({
		where: { ownerId: 4, name: 'Маркетинг' },
	});

	await Project.findOrCreate({
		where: { ownerId: 5, name: 'Спорт' },
	});

	await Project.findOrCreate({
		where: { ownerId: 6, name: 'Кинотеатр' },
	});

	await Project.findOrCreate({
		where: { ownerId: 7, name: 'Музыка' },
	});
};
