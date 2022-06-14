import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const axiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const createInstance = axios.create({
    baseURL: "https://kauth.kakao.com/oauth",
    timeout: 5 * 1000,
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...config?.headers,
    },
  });

  return createInstance;
};

export default axiosInstance;
