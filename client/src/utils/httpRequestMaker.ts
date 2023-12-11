export const httpRequestMaker = {
  makeGetRequest: async (url: string, path: string) => {
    return fetch(`${url}/${path}`, {
      method: 'GET',
      // credentials: 'include',
      // headers: {
      //   Connection: 'keep-alive',
      // },
    });
  },
};
