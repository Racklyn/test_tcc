import { Post } from '../post.entity';

export class PostResponseDto extends Post {
    analysis_outdated: boolean;
    average_score?: number;
}
