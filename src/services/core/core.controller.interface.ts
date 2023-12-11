import { Request, Response, NextFunction, Router } from 'express';

export interface ICoreController {
	close: (req: Request, res: Response, next: NextFunction) => void;
	router: Router;
}
