import type { Page } from "./page"

export type Brand = {
    id: string
    name: string
    about: string
    pages: Page[]
    createdAt?: Date
    updatedAt?: Date
}