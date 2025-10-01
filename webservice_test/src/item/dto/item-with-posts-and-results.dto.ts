import { ApiProperty } from '@nestjs/swagger';
import { ItemAnalysisResult } from 'src/item-analysis-result/item-analysis-result.entity';

export class PostWithCommentsCountDto {
    @ApiProperty({ description: 'ID único do post' })
    id: number;

    @ApiProperty({ description: 'Conteúdo do post', required: false })
    content?: string;

    @ApiProperty({ description: 'Resumo do post', required: false })
    summary?: string;

    @ApiProperty({ description: 'Data do post' })
    post_date: Date;

    @ApiProperty({ description: 'Número de reações', required: false })
    reactions?: number;

    @ApiProperty({ description: 'URL do post', required: false })
    url?: string;

    @ApiProperty({ description: 'Data do comentário mais recente', required: false })
    newest_comment_date?: Date;

    @ApiProperty({ description: 'Data da última análise', required: false })
    last_analysis?: Date;

    @ApiProperty({ description: 'Data da última extração', required: false })
    last_extraction?: Date;

    @ApiProperty({ description: 'Data de criação do registro' })
    created_date: Date;

    @ApiProperty({ description: 'Data de atualização do registro' })
    updated_date: Date;

    @ApiProperty({ description: 'Item associado ao post' })
    item: any;

    @ApiProperty({ description: 'Número de comentários do post' })
    comments_count: number;

    @ApiProperty({ 
        description: 'Média dos scores de todas as análises dos comentários deste post',
        type: 'number',
        nullable: true,
        example: 0.75
    })
    average_score: number | null;
}

export class ItemWithPostsAndResultsDto {
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
        description: 'Percentual de comentários com análise de sentimentos (sempre 100% quando há comentários analisados)',
        type: 'number',
        example: 100
    })
    percentage_of_comments_related_to_item: number;

    @ApiProperty({
        description: 'Contagem de comentários negativos (score = 0)',
        type: 'number',
        example: 12
    })
    negatives_count: number;

    @ApiProperty({
        description: 'Contagem de comentários neutros (score = 0.5)',
        type: 'number',
        example: 8
    })
    neutral_count: number;

    @ApiProperty({
        description: 'Contagem de comentários positivos (score = 1)',
        type: 'number',
        example: 25
    })
    positives_count: number;

    @ApiProperty({
        description: 'Número total de posts associados a este item',
        type: 'number',
        example: 15
    })
    posts_count: number;

    @ApiProperty({ 
        description: 'Lista de posts com contagem de comentários',
        type: [PostWithCommentsCountDto]
    })
    posts: PostWithCommentsCountDto[];

    @ApiProperty({ 
        description: 'Análise mais recente do item',
        type: ItemAnalysisResult,
        nullable: true
    })
    latest_analysis_result: ItemAnalysisResult | null;
}
