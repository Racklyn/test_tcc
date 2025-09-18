import api from './api'
import type { Brand, BrandQueryParams, CreateBrandDto, UpdateBrandDto } from '@/models/brand'

const resource = '/brand'

export default {
    get: async (queryParams: BrandQueryParams) => {
        const response = await api.get<Brand[]>(resource, { params: queryParams })
        return response.data
    },

    create: async (brand: CreateBrandDto) => {
        const response = await api.post(resource, brand)
        return response.data
    },

    update: async (brand: UpdateBrandDto) => {
        const response = await api.patch(`${resource}/${brand.id}`, brand)
        return response.data
    },

    delete: async (id: string) => {
        const response = await api.delete(`${resource}/${id}`)
        return response.data
    }
}

