import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, 
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config; 
  },
  (error) => {
    return Promise.reject(error);
  }
);


