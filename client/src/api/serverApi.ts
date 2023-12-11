import { BASE_URL } from 'utils';

export const fetchServerData = {
  getServerInfo: async (): Promise<any> => {
    const response = await fetch(`${BASE_URL}/core/getServerInfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  },
};
