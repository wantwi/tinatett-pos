import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
import useCustomApi from "./useCustomApi";

export const usePost = (url, key, onsuccess = () => {}, onError = () => {}) => {
  const axios = useCustomApi();
  const queryClient = useQueryClient()

  async function createPost(postData) {
    const response = await axios.post(url, postData);
    //console.log(response.data)
    return response.data;
  }

  const reactQuery  = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [key] })
      onsuccess(data)
    },
    onError:(error) => onError(error)

  });

  return  reactQuery 
};
