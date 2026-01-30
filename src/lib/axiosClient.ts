import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.FUNCSTER_BACKEND_URL,
  withCredentials: true,
});



export const apiClient = axios.create({
  withCredentials: true,
});