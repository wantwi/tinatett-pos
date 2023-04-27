import { useQuery } from "@tanstack/react-query"
import axios from "axios";


export const useGet = (key, url) => {

    const getData = async () => {
        return axios.get(url).then((res) => res.data);
    }
    const { data, isLoading, isError, refetch, isSuccess, status } = useQuery([key],getData);

    return { data, refetch, isError, isLoading, isSuccess, status}
}