import { useQuery } from "@tanstack/react-query";
import useCustomApi from "./useCustomApi";

export const useGet = (key, url) => {
  const axios = useCustomApi();

  const getData = async () => {
    const res = await axios.get(url);
    return res.data;
  };
  const { data, isLoading, isError, refetch, isSuccess, status } = useQuery(
    [key],
    getData,
    {
      refetchOnWindowFocus:true,
    
    }
  );

  return { data, refetch, isError, isLoading, isSuccess, status };
};