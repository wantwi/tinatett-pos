import { useQuery } from "@tanstack/react-query";
import useCustomApi from "./useCustomApi";

export const useGet = (key, url, onSuccess =()=>{}, onError = () => {}) => {
  const axios = useCustomApi();

  const getData = async () => {
    const res = await axios.get(url);
    return res.data;
  };
  const { data, isLoading, isError, refetch, isSuccess, status, isFetching, isFetched } = useQuery({
    queryKey: [key],
    queryFn: getData,
    onSuccess:(result)=>{onSuccess(result)},
    onError:(err)=>{onError(err)},


  });

  return { data, refetch, isError, isLoading, isSuccess, status, isFetching, isFetched };
};
