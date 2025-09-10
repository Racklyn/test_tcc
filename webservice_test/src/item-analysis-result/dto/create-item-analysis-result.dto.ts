import { ApiProperty } from '@nestjs/swagger';

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
        nullable: true,
        default: new Date(),
    })
    analysis_date?: Date;

    @ApiProperty()
    item_id: number;
}
