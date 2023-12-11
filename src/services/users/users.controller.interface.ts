import { NextFunction, Request, Response, Router } from 'express';

export interface IUserController {
	router: Router;
	createUser: (req: Request, res: Response, next: NextFunction) => void;
	updateUser: (req: Request, res: Response, next: NextFunction) => void;
	deleteUser: (req: Request, res: Response, next: NextFunction) => void;
	findByIdUser: (req: Request, res: Response, next: NextFunction) => void;
	findAllUsers: (req: Request, res: Response, next: NextFunction) => void;
}
