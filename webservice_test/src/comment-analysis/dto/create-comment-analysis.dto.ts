import { Comment } from 'src/comment/comment.entity';

export class CreateCommentAnalysisDto {
    id?: number;
    score: number;
    version: number;
    related_to: 'POST_ITEM' | 'POST_BRAND' | 'BEYOND_POST';
    analysis_date: Date;
    comment: Comment;
}
