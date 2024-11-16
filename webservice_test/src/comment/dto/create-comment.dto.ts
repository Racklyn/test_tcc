import { CommentAnalysis } from 'src/comment-analysis/comment-analysis.entity';
import { Post } from 'src/post/post.entity';

export class CreateCommentDto {
    id?: number;
    text: string;
    date: Date;
    reactions?: number;
    post: Post;
    comment_analysis: CommentAnalysis[];
}
