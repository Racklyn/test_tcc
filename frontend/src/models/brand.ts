import type { Page, CreatePageDto } from "./page"

export type Brand = {
    id: string
    name: string
    about: string
    pages: Page[]
    created_at?: string
    updated_at?: string
}

export type BrandQueryParams = {
    sort_order?: string
    sort_by?: string
    user_id: number
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