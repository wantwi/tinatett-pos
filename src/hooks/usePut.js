import { useMutation } from "@tanstack/react-query";
import useCustomApi from "./useCustomApi";

export const usePut = (url) => {
  const axios = useCustomApi();
  async function updatePost(postData) {
    const response = await axios.put(url, postData);
    return response.data;
  }

  const { isLoading, isError, error, mutate } = useMutation(updatePost);

  return { isLoading, isError, error, mutate };
};
