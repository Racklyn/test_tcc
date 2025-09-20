export type Post = {
    id: string
    content?: string
    summary?: string
    post_date: string
    reactions?: number
    url?: string
    newest_comment_date?: string
    last_analysis?: string
    analysis_outdated?: boolean
    average_score?: number
    comments_count?: number
    created_date: string
    updated_date: string
}