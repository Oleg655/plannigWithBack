import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
	@IsInt({ message: 'Не указан идентификатор пользователя' })
	id: number;

	@IsString({ message: 'Не указан логин' })
	login: string;

	@IsEmail({}, { message: 'Неверно указан email' })
	@IsOptional()
	email: string | null;

	@IsString({ message: 'Не указано имя' })
	name: string;
}
