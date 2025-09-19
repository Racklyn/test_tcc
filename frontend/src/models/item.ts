import type { Post } from "./post"

export type Item = {
    id: string
    name: string
    block_name_from_updates?: boolean
    type: 'product' | 'service'
    description: string
    last_sync?: string
    item_analysis_result?: ItemAnalysisResult[]
    posts?: Post[]
    created_at: string
    updated_at: string
    item_average_score?: number
}


//TODO: criar o modelo de ItemAnalysisResult separado
export type ItemAnalysisResult = {
    id: string
    // Adicione outros campos conforme necessário
}
