import ScraperApi from './api'

export default {
    extractFromAllPagesOfBrand: async (brand_id: string, date_since_str?: string) => {  
        const response = await ScraperApi.post<DefaultResponse>('extractFromAllPagesOfBrand', {}, { 
            params: {
                brand_id,
                date_since_str
            }
        })
        return response.data
    },

}

export type DefaultResponse = {
    message: string
    status: string
}