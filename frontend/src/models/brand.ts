import type { Page, CreatePageDto } from "./page"
import type { ItemNoPosts } from "./item"

export type Brand = {
    id: string
    name: string
    about: string
    pages: Page[]
    created_date?: string
    updated_date?: string
}

export type BrandWithItemsAndStatistics = Brand & {
    items: ItemNoPosts[]
    brand_average_score?: number
}



export type CreateBrandDto = {
    name: string
    about: string
    pages: CreatePageDto[]
    user_id: number
}

export type UpdateBrandDto = {
    id: string
    name: string
    about: string
    pages: CreatePageDto[]
    user_id: number
}

export type BrandQueryParams = {
    sort_order?: string
    sort_by?: string
    user_id: number
}