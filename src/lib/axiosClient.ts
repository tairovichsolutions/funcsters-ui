import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.FUNCSTER_BACKEND_URL,
});
