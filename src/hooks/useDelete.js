import { useMutation } from "@tanstack/react-query"
import axios from "axios";


export const useDelete = (url, postData) => {

    async function deletePost() {
        const response = await axios.delete(url, postData)
        return response.data
    }

    const { isLoading, isError, error, mutate } = useMutation(deletePost);

    return {isLoading, isError, error, mutate}
}


    
    
