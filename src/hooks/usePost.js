import { useMutation } from "@tanstack/react-query"
import axios from "axios";


export const usePost = (url, postData) => {

    async function createPost() {
        const response = await axios.post(url, postData)
        return response.data
    }

    const { isLoading, isError, error, mutate } = useMutation(createPost);

    return {isLoading, isError, error, mutate}
}


    
    
