import { IsInt } from 'class-validator';

export class UserLoginDto {
	@IsInt({ message: 'Не указан идентификатор пользователя' })
	id: number;
}
