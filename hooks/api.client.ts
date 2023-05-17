import axios, { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "/",
});

// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const jwt = localStorage.getItem("jwt");
//       if (jwt) {
//         config.headers.Authorization = `Bearer ${jwt}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default api;

export const fetcherWithConfig = ([url, config]: [
  string,
  AxiosRequestConfig
]) => api.get(url, config).then((res) => res.data);

export const basicFetcher = (url:string) => api.get(url).then(res => res.data);
