import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/comment/comment.entity';
import { Item } from 'src/item/item.entity';
import { Page } from 'src/page/page.entity';

export class CreatePostDto {
    @ApiProperty()
    id: number;

    @ApiProperty({
        example: 'Descobra as novas funcionalidades do A55, o smartphone perfeito para você!',
        nullable: true
    })
    content?: string;

    @ApiProperty({
        nullable: true
    })
    summary?: string;

    @ApiProperty({
        example: new Date()
    })
    post_date: Date;

    @ApiProperty({
        example: 1,
        nullable: true
    })
    reactions?: number;

    @ApiProperty({
        nullable: true
    })
    url?: string; //TODO: verificar se é necessário isso. Aparentemente, não é possível pegar sem estar logado

    @ApiProperty({
        example: new Date,
        nullable: true
    })
    last_analysis?: Date;

    @ApiProperty()
    page: Page;

    @ApiProperty()
    item: Item;

    @ApiProperty({
        example: [],
        nullable: true
    })
    comments?: Comment[];
}
