import axios from 'axios';

const AuthFetchService = {
    async fetch(url, method, body, jwt) {
      try {
        const headers = {
          Authorization: 'Bearer ' + jwt,
          'Content-Type': 'application/json'
        };
        let response;
        if (method === 'GET') {
          response = await axios.get(url, { headers });
        } else if (method === 'POST') {
          response = await axios.post(url, body, { headers });
        } else if (method === 'PUT') {
          response = await axios.put(url, body, { headers });
        } else if (method === 'DELETE') {
          response = await axios.delete(url, { headers });
        }
        return response.data;
      } catch (err) {
        console.error(err);
      }
    }
  };

export default AuthFetchService;