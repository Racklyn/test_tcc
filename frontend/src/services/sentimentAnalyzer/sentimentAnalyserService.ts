import AIApi from './api'

export default {
    runAnalysis: async (brand_id: string, date_since_str?: string) => {
        const response = await AIApi.post<DefaultResponse>('runAnalysis', {}, {
            params: {
                brand_id,
                date_since_str
            }
        })
        return response.data
    },

    updateItem: async (item_id: string) => {
        const response = await AIApi.post<DefaultResponse>('updateItem', {}, {
            params: {
                item_id
            }
        })
        return response.data
    },

    updateAllItemsFromBrand: async (brand_id: string) => {
        const response = await AIApi.post<DefaultResponse>('updateAllItemsFromBrand', {}, {
            params: {
                brand_id
            }
        })
        return response.data
    }
}

export type DefaultResponse = {
    message: string
    status: string
    data: any
}