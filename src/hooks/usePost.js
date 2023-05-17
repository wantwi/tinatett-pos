import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
import useCustomApi from "./useCustomApi";

export const usePost = (url) => {
  const axios = useCustomApi();

  async function createPost(postData) {
    const response = await axios.post(url, postData);
    console.log(response.data)
    return response.data;
  }

  const { isLoading, isError, error, mutate } = useMutation(createPost);

  return { isLoading, isError, error, mutate };
};
