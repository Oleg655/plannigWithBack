import { httpRequestMaker } from 'api';
import { BASE_URL } from 'utils';

export const fetchUsersData = {
  getUserInfo: async (): Promise<any> => {
    return httpRequestMaker.makeGetRequest(BASE_URL, 'api/getUserInfo');
  },
};
