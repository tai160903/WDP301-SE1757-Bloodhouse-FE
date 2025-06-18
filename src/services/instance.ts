import axios from "axios";
import { BASE_URL } from "@/constants/globalVariables";

export const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 5000,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

instance.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
