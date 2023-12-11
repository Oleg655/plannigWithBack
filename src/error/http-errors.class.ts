export class HTTPError extends Error {
	title = 'Что-то пошло не так';
	statusCode: number;

	constructor(message: string, statusCode = 500) {
		super(message);
		this.statusCode = statusCode;
	}
}

export class AuthorizationError extends HTTPError {
	title = 'Ошибка авторизации';

	constructor(message: string) {
		super(message, 401);
	}
}

export class AccessError extends HTTPError {
	title = 'Отсутствует доступ к подсистеме';

	constructor(message: string) {
		super(message, 403);
	}
}

export class ConnectionError extends HTTPError {
	title = 'Ошибка соединения';

	constructor(message: string) {
		super(message, 500);
	}
}
