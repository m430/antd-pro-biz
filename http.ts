import axios from 'axios';

// axios.defaults.baseURL = 'https://magpiee.com.cn:28443';

axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response.data;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default axios;