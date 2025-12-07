// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '', // proxy 설정을 했으므로 비워둠
  withCredentials: true, //(세션 쿠키를 주고받겠다는 설정)
});

export default api;