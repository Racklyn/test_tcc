import { ApiProperty } from '@nestjs/swagger';
import { Item } from '../item.entity';
import { PostWithAverageScoreDto } from './post-with-average-score.dto';

export class ItemResponseDto {
    @ApiProperty({ description: 'ID único do item' })
    id: number;

    @ApiProperty({ description: 'Nome do item' })
    name: string;

    @ApiProperty({ description: 'Indica se o nome do item está bloqueado para atualizações', required: false })
    block_name_from_updates?: boolean;

    @ApiProperty({ description: 'Tipo do item', enum: ['product', 'service'] })
    type: 'product' | 'service';

    @ApiProperty({ description: 'Descrição do item' })
    description: string;

    @ApiProperty({ description: 'Data da última sincronização', required: false })
    last_sync?: Date;

    @ApiProperty({ description: 'Data de criação do registro' })
    created_date: Date;

    @ApiProperty({ description: 'Data de atualização do registro' })
    updated_date: Date;

    @ApiProperty({ description: 'Marca associada ao item' })
    brand: any;

    @ApiProperty({ description: 'Resultados de análise do item', required: false })
    item_analysis_result?: any[];

    @ApiProperty({
        description: 'Indica se o item precisa ser atualizado/sincronizado',
        example: true,
        default: false
    })
    outdated: boolean;

    @ApiProperty({
        description: 'Média dos average_scores de todos os posts deste item',
        type: 'number',
        nullable: true,
        example: 0.65
    })
    item_average_score?: number | null;

    @ApiProperty({
        description: 'Posts do item com seus average_scores',
        type: 'array',
        items: { $ref: '#/components/schemas/PostWithAverageScoreDto' }
    })
    posts?: PostWithAverageScoreDto[];
}
