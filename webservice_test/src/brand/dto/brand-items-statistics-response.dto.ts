import { ApiProperty } from '@nestjs/swagger';
import { ItemWithPostsCountDto } from '../../item/dto/item-with-posts-count.dto';

export class BrandInfoDto {
    @ApiProperty({ description: 'ID único da marca' })
    id: number;

    @ApiProperty({ description: 'Nome da marca' })
    name: string;

    @ApiProperty({ description: 'Sobre a marca', required: false })
    about?: string;

    @ApiProperty({ description: 'Data de criação do registro' })
    created_date: Date;

    @ApiProperty({ description: 'Data de atualização do registro' })
    updated_date: Date;

    @ApiProperty({
        description: 'Páginas da marca',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                page_description: { type: 'string' },
                created_date: { type: 'string', format: 'date-time' },
                updated_date: { type: 'string', format: 'date-time' }
            }
        }
    })
    pages: PageInfoDto[];

    @ApiProperty({
        description: 'Itens da marca com contagem de posts e average_scores',
        type: 'array',
        items: { $ref: '#/components/schemas/ItemWithPostsCountDto' }
    })
    items: ItemWithPostsCountDto[];

    @ApiProperty({
        description: 'Média dos item_average_scores de todos os itens da marca',
        type: 'number',
        nullable: true,
        example: 0.72
    })
    brand_average_score: number | null;
}

export class PageInfoDto {
    @ApiProperty({ description: 'ID único da página' })
    id: number;

    @ApiProperty({ description: 'Título da página' })
    title: string;

    @ApiProperty({ description: 'Descrição da página', required: false })
    page_description?: string;

    @ApiProperty({ description: 'Data de criação do registro' })
    created_date: Date;

    @ApiProperty({ description: 'Data de atualização do registro' })
    updated_date: Date;
}

export class BrandItemsStatisticsResponseDto {
    @ApiProperty({
        description: 'Informações completas da marca incluindo páginas, itens e estatísticas',
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            about: { type: 'string' },
            created_date: { type: 'string', format: 'date-time' },
            updated_date: { type: 'string', format: 'date-time' },
            pages: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        title: { type: 'string' },
                        page_description: { type: 'string' },
                        created_date: { type: 'string', format: 'date-time' },
                        updated_date: { type: 'string', format: 'date-time' }
                    }
                }
            },
            items: {
                type: 'array',
                items: { $ref: '#/components/schemas/ItemWithPostsCountDto' }
            },
            brand_average_score: { type: 'number', nullable: true }
        }
    })
    brand: BrandInfoDto;
}
