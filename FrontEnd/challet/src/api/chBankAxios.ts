import axios from 'axios';

const chBankAxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/ch-bank',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default chBankAxiosInstance;
