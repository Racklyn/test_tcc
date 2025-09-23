import type { Post, PostQueryParams, PostWithItem } from '@/models/post'
import api from './api'
    

const resource = '/post'

export default {

    getAllPostsAndItemsFromBrand: async (queryParams: PostQueryParams) => {
        const response = await api.get<PostWithItem[]>(`${resource}/withItem`,{ params: queryParams })
        return response.data
    },
}

