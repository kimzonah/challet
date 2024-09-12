import axios from 'axios';

// axios 인스턴스
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance; // default export로 내보냄
