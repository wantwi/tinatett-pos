import axios from "axios";

//const BASE_URL = "http://localhost:9050/api";

const BASE_URL = "https://stockmanager.akwaabaevolution.com/api";
//
export const CustomAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
