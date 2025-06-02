import axios, {AxiosInstance} from 'axios';

const api_cartGuest: AxiosInstance = axios.create({
  baseURL: 'http://192.168.34.166:8080/api/v1/pharmacy',
  withCredentials: true,
});

export default api_cartGuest;
