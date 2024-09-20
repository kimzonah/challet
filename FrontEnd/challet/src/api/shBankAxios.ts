import axios from 'axios';

const shBankAxiosInstance = axios.create({
  baseURL: 'http://localhost:8085/api/sh-bank',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default shBankAxiosInstance;
