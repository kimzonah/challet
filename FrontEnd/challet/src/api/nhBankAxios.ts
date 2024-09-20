import axios from 'axios';

const nhBankAxiosInstance = axios.create({
  baseURL: 'http://localhost:8084/api/nh-bank',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default nhBankAxiosInstance;
