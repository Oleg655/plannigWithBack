import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsString({ message: 'Не указан логин' })
	login: string;

	@IsEmail({}, { message: 'Неверно указан email' })
	@IsOptional()
	email: string | null;

	@IsString({ message: 'Не указано имя' })
	name: string;
}
