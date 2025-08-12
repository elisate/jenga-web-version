import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle errors globally

export const api = axiosInstance;

export const getApi = <T>(url: string, config?: AxiosRequestConfig) =>
  api.get<T>(url, config).then((response) => response.data);

export const postApi = <T>(
  url: string,
  data?: object | FormData,
  config?: AxiosRequestConfig
) => api.post<T>(url, data, config).then((response) => response.data);

export const putApi = <T>(
  url: string,
  data?: object | FormData,
  config?: AxiosRequestConfig
) => api.put<T>(url, data, config).then((response) => response.data);

export const delApi = <T>(url: string, config?: AxiosRequestConfig) =>
  api.delete<T>(url, config).then((response) => response.data);

export default api;
