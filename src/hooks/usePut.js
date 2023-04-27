import { useMutation } from "@tanstack/react-query"
import axios from "axios";


export const usePut = (url, postData) => {

    async function updatePost() {
        const response = await axios.put(url, postData)
        return response.data
    }

    const { isLoading, isError, error, mutate } = useMutation(updatePost);

    return {isLoading, isError, error, mutate}
}


    
    
