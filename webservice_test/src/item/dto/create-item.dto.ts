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
        example: 'PRODUCT'
    })
    type: 'PRODUCT' | 'SERVICE';

    @ApiProperty({
        example: 'Smartphone'
    })
    description: string;

    @ApiProperty({
        example: new Date(),
        nullable: true
    })
    last_analysis?: Date;

    @ApiProperty()
    brand: Brand;

    // @ApiProperty({
    //     example: [],
    //     nullable: true
    // })
    // item_analysis_result?: ItemAnalysisResult[];

    //TODO: verificar se é necessário essa lista no momento da inserção
    @ApiProperty({
        example: [],
        nullable: true
    })
    posts?: Post[]
}
