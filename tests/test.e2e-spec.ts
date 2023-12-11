import { wrapper } from 'axios-cookiejar-support';
import axios from 'axios';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const port = 5000;
const pluginRoute = 'planning';
const route = 'api';
const app = `http://localhost:${port}/${pluginRoute}/${route}`;

describe('Users e2e', () => {
	it('Test - POST /login', async () => {
		const res = await client.post(`${app}/login`);
		expect(res.status).toBe(200);
		expect(res.data).toEqual('login!');
	});
});
