import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IClient } from '../client/client.interface';
import { AxiosInstance } from 'axios';
import { SubsystemTypes } from '../client/http.client';
import { IRdmService } from './rdm.service.interface';

@injectable()
export class RdmSystem implements IRdmService {
	client: AxiosInstance;

	constructor(@inject(TYPES.HttpClient) public clientHttp: IClient) {}

	async init(): Promise<void> {
		this.client = await this.clientHttp.getClient(SubsystemTypes.RDM);
	}

	async getEmps(filters = {}, fields: string[]): Promise<any> {
		filters = this.handleIsActiveFilter(filters);

		const response = await this.client.post(
			'/empls',
			{
				fields: fields.join(','),
				filters,
				limit: '-1',
			},
			{ headers: { 'x-http-method-override': 'GET' } },
		);

		return response.data.data;
	}

	private handleIsActiveFilter(filters: any) {
		//TODO: Зачем это?
		if (!filters.hasOwnProperty('isActive')) filters.isActive = true;
		if (filters.isActive === null) delete filters.isActive;

		return filters;
	}
}
