import axios from "axios";

//const BASE_URL = "http://localhost:9050/api";

export const BASE_URL = "https://backendapi.akwaabaevolution.com/api";
//
export const CustomAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
