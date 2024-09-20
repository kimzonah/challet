import axios from 'axios';

const kbBankAxiosInstance = axios.create({
  baseURL: 'http://localhost:8083/api/kb-bank',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default kbBankAxiosInstance;
