import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: "http://10.0.2.2:8080/api/v1/pharmacy",
});

export default api;
