import type { Brand } from "./brand"
import type { ItemAnalysisResult } from "./itemAnalysisResult"
import type { Post } from "./post"

export type ItemNoPosts = {
    id: number
    name: string
    block_name_from_updates?: boolean
    type: 'product' | 'service'
    description: string
    last_sync?: string
    posts_count?: number
    created_date: string
    updated_date: string
    item_average_score?: number
    outdated?: boolean
}

export type Item = ItemNoPosts & {
    posts?: Post[]
}

export type ItemWithPostsAndResult = Item & {
    latest_analysis_result?: ItemAnalysisResult,
    brand: Brand
    percentage_of_comments_related_to_item?: number
    negatives_count?: number
    neutral_count?: number
    positives_count?: number
}

export type ItemUpdateDto = Partial<Item>