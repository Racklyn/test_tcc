import api from './api'
import type { ItemUpdateDto, ItemWithPostsAndResult } from '@/models/item'

const resource = '/item'

export default {

    getWithPostsAndResult: async (id: number) => {
        const response = await api.get<ItemWithPostsAndResult>(`${resource}/${id}/withPostsAndResult`)
        return response.data
    },

    setBlockNameFromUpdates: async (item_id: number, value: boolean) => {
        const body: ItemUpdateDto = {
            block_name_from_updates: value
        }
        const response = await api.patch<ItemUpdateDto>(`${resource}/${item_id}`, body)
        return response.data
    }
}