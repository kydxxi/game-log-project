// src/api.js
import axios from 'axios';

const api = axios.create({
  // 백엔드 서버 주소
  baseURL: 'http://localhost:4000/api',
  withCredentials: true, // 세션 쿠키 사용
});

export default api;
