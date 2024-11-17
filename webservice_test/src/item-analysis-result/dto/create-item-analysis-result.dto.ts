import { ApiProperty } from '@nestjs/swagger';
import { Item } from 'src/item/item.entity';

export class CreateItemAnalysisResultDto {
    @ApiProperty()
    id: number;

    @ApiProperty({
        example: 'Em geral, o produto é bem visto pelos usuários'
    })
    analysis_summary: string;

    @ApiProperty({
        example: 'Câmera muito boa e tela grande'
    })
    positive_points: string;

    @ApiProperty({
        example: 'Bateria ruim e material frágil'
    })
    negative_points: string;

    @ApiProperty({
        example: new Date(),
        nullable: true
    })
    analysis_date?: Date;

    @ApiProperty({
        example: 1
    })
    version: number;

    @ApiProperty()
    item: Item;
}
