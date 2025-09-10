import { ApiProperty } from '@nestjs/swagger';
import { Brand } from 'src/brand/brand.entity';
import { ItemAnalysisResult } from 'src/item-analysis-result/item-analysis-result.entity';
import { Post } from 'src/post/post.entity';

export class CreateItemDto {
    @ApiProperty()
    id: number;

    @ApiProperty({
        example: 'Galaxy A55'
    })
    name: string;

    @ApiProperty({
        example: 'product'
    })
    type: 'product' | 'service';

    @ApiProperty({
        example: 'Smartphone'
    })
    description: string;

    @ApiProperty({
        example: new Date(),
        nullable: true
    })
    last_sync?: Date;

    @ApiProperty()
    brand_id: number;

    @ApiProperty({
        nullable: true,
        default: false
    })
    block_name_from_updates?: boolean;

    @ApiProperty({
        example: [],
        nullable: true
    })
    posts?: Post[]
}
