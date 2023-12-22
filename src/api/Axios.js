import axios from "axios";

export default axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_REACT_APP_API_AXIOS,
});

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_AXIOS,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
