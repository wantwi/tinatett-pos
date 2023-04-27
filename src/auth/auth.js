import { CustomAxios } from "../api/CustomAxios";

export const LoginUser = async (data) => {
  const response = await CustomAxios.post("/auth/login", data);
  return response.data;
};

// export const renewToken = async () => {
//   const response = await CustomAxios.get("/refresh");
//   return response.data;
// };

// export const logout = async () => {
//   const response = await CustomAxios.get("/logout");
//   return response.data;
// };
