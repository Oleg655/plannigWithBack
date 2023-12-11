declare namespace Express {
	export interface Request {
		KServer : {
            session: any;
        },
        user: any;
	}
}