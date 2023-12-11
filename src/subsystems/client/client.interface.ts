import axios, { AxiosInstance } from 'axios';
import { SubsystemTypes } from './http.client';

export interface IClient {
	login: string;
	path: string;
	getClient: (stype: SubsystemTypes) => Promise<AxiosInstance>;
}
