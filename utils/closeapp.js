/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const CookieJar = require('tough-cookie').CookieJar;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;

const cookieJar = new CookieJar()

axiosCookieJarSupport(axios)

const result = axios.post('http://localhost:5000/planning/core/close',{}, {
	auth: {
	  username: 'kodeks',
	  password: 'kodeks'
	},
	jar: cookieJar,
	withCredentials: true,
}).then((response) => {
	console.log(response.data);
}).catch((error) => {
	console.log(error);
})
