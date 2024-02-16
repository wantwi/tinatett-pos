import axios from "axios";

// export const BASE_URL = "http://localhost:9050/api";
// export const SOCKET_BASE_URL = 'https://backendapi-v2.akwaabaevolution.com'
// export const BASE_URL = "https://api.tinatettherbalpos.com/api";
export const BASE_URL = "https://backendapi.akwaabaevolution.com/api"

export const CustomAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
