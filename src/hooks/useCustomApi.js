import { CustomAxios } from "../api/CustomAxios";
import useAuth from "./useAuth";
import { useEffect } from "react";

// import useRefreshtoken from "./useRefreshtoken"

const useCustomApi = () => {
  const { auth } = useAuth();
  //  const refresh = useRefreshtoken()

  

  useEffect(() => {
    const requestintercept = CustomAxios?.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${auth?.token}`;
        }
        console.log('asdasdasdas', config)
        return config;
      },
      (error) => Promise.reject(error)
    );

    

    const responseintercept = CustomAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          // prevRequest.sent = true
          //  const newtoken =null //await refresh()
          // prevRequest.headers.Authorization = `Bearer ${newtoken}`
          // return CustomAxios(prevRequest)
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      CustomAxios.interceptors.request.eject(requestintercept);
      CustomAxios.interceptors.response.eject(responseintercept);
    };
  }, [auth]);

  return CustomAxios;
};

export default useCustomApi;
