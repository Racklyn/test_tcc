import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/comment/comment.entity';

export class CreateCommentAnalysisDto {
    @ApiProperty()
    id: number;

    @ApiProperty({
        example: 1,
        description: 'Valor da análise de sentimentos entre 0 e 1'
    })
    score: number;

    @ApiProperty({
        example: 1
    })
    version: number;

    @ApiProperty({
        example: 'POST_ITEM'
    })
    related_to: 'POST_ITEM' | 'POST_BRAND' | 'BEYOND_POST';

    @ApiProperty({
        example: new Date()
    })
    analysis_date: Date;

    @ApiProperty()
    comment: Comment;
}
