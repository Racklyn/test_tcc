import { ApiProperty } from '@nestjs/swagger';
import { Item } from '../../item/item.entity';

export class PostWithItemDto {
    @ApiProperty({ description: 'ID único do post' })
    id: number;

    @ApiProperty({ description: 'Conteúdo do post', required: false })
    content?: string;

    @ApiProperty({ description: 'Resumo do post', required: false })
    summary?: string;

    @ApiProperty({ description: 'Data de criação do post' })
    post_date: Date;

    @ApiProperty({ description: 'Número de reações', required: false })
    reactions?: number;

    @ApiProperty({ description: 'URL do post', required: false })
    url?: string;

    @ApiProperty({ description: 'Data do comentário mais recente', required: false })
    newest_comment_date?: Date;

    @ApiProperty({ description: 'Data da última análise', required: false })
    last_analysis?: Date;

    @ApiProperty({ description: 'Data de criação do registro' })
    created_date: Date;

    @ApiProperty({ description: 'Data de atualização do registro' })
    updated_date: Date;

    @ApiProperty({ description: 'Página associada ao post' })
    page: any;

    @ApiProperty({ 
        description: 'Item associado ao post',
        nullable: true
    })
    item?: Item | null;

    @ApiProperty({ 
        description: 'Média dos scores de todas as análises dos comentários deste post',
        type: 'number',
        nullable: true,
        example: 0.75
    })
    average_score: number | null;

    @ApiProperty({
        description: 'Número de comentários do post',
        type: 'number',
        example: 15
    })
    comments_count: number;
}
