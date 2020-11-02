const axios = require('axios').default;

const api = axios.create({
  baseURL: `https://five-m.store/api/${process.env.TOKEN}`
});

api.fetchStatus = () => api.get(`https://five-m.store/api/v2/status`, {
  headers: {
    Authorization: process.env.TOKEN
  }
});

module.exports = api;