import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/post/post.entity';

export class CreateCommentDto {
    @ApiProperty({
        example: 'Gosto muito desse produto!'
    })
    text: string;

    @ApiProperty({
        example: new Date()
    })
    date: Date;

    @ApiProperty({
        example: 'Autor do comentário'
    })
    autor: string;

    @ApiProperty({
        example: 20,
        description: 'Número de reação da publicação',
        nullable: true
    })
    reactions?: number;

    @ApiProperty()
    post: Post;

    // @ApiProperty({
    //     example: [],
    //     nullable: true
    // })
    // comment_analysis?: CommentAnalysis[];
}
