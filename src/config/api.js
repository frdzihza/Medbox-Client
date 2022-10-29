import axios from 'axios';

export const API_URL =
  process.env.NEXT_PUBLIC_API || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;