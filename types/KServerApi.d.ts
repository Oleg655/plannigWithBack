export {};

declare class ServerInfo {
	/**
	* Порт
	*/ 
	Port: number;
	/**
	* Имя хоста
	*/        
	Hostname: string;  
	/**
	* Протокол
	*/     
	Protocol: string; 
	/**
	* Полный путь к хосту, включая порт
	*/        
	Host: string;        
	/**
	* Предпочтительный виртуальный каталог
	*/   
	PreferredVDir: string;  
}

declare class PackageInfo {
	author: string;
	description: string;
	name: string;
	version: string;
	license: string;
	main: string;
	route: string;
	build: number;
}

declare class UserGroup {
	id: number;
	name: string;
	abbreviation: string;
}

export declare class UserInfo {
	authenticated: boolean;
	department: string;
	disabled: boolean;
	email: string;
	expired: boolean;
	id: number;
	login: string;
	name: string;
	position: string;
	groups: UserGroup[];
}

declare global {
	var KServerApi: {
		/* #region  Свойства*/
		/**
		 * Уникальное имя в пределах монитора имя плагина
		 */
		Name: string;
		/**
		 * Полный путь к плагину
		 */
		Path: string;
		/**
		 * Полный путь к каталогу, в котором предполагается хранение файлов плагинов
		 */
		StoragePath: string;
		/**
		 * Полный путь к каталогу логов плагина
		 */
		LogsPath: string;
		/**
		 * Имя сокета, который должен слушать плагин
		 */
		SocketPath: string;
		/**
		 * Информация о плагине
		 */
		Route: string;
		/**
		 * package.json плагина
		 */
		Info: PackageInfo;

		/* #endregion */

		/* #region Методы */
		/**
		 * метод для получения информации о пользователе
		 */
		UserInfo(req: import("express").Request): Promise<UserInfo>;
		/**
		 * метод для получения информации о пользователях
		 * 
		 */
		UserList: Function;
		/**
		 * метод для проверки доступа к функционалу
		 */
		CheckAccess: Function;
		/**
		 * метод для проверки доступа к функционалам
		 */
		PickPermissions: Function;
		/**
		 * метод для получения информации о документе ИС "Кодекс/Техэксперт"
		 */
		KodeksDocInfo: Function;
		/**
		 * метод для получения статуса продукта ИС "Кодекс/Техэксперт"
		 */
		KodeksProductStatus: Function;
		/**
		 * метод для отправки почтового сообщения
		 */
		SendMail: Function;
		/**
		 * метод для получения адреса, порта и виртуального каталога
		 */
		GetServerInfo(): Promise<ServerInfo>;
		/**
		 * метод для получения названия сервиса
		 */
		GetServiceName: Function;
		/**
		 * собирает относящуюся к KServer'у информацию о запросе и помещает её в свойство KServer объекта request
		 */
		pickKServerInfo: Function;
		/* #endregion */
	};
}
