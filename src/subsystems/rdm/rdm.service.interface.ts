import { IClient } from '../client/client.interface';

export interface IRdmService {
	clientHttp: IClient;
	getEmps: (filters: any, fields: any) => Promise<any>;
	init: () => Promise<void>;
}
