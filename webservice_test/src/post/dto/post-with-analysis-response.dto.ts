import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../post.entity';

// Importar os tipos do service para manter consistência
export type CommentAnalysisWithoutComment = {
    id: number;
    version: number;
    score: number;
    related_to: 'POST_ITEM' | 'POST_BRAND' | 'BEYOND_POST';
    analysis_date: Date;
    analyzer_infos?: string;
    created_date: Date;
    updated_date: Date;
};

export type CommentWithAnalysis = {
    key: string;
    text: string;
    date: Date;
    reactions?: number;
    created_date: Date;
    updated_date: Date;
    author: string;
    comment_analysis: CommentAnalysisWithoutComment[];
};

export class PostWithAnalysisResponseDto {
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
    page: any; // Pode ser Page ou apenas ID

    @ApiProperty({ description: 'Item associado ao post', required: false })
    item?: any; // Pode ser Item ou apenas ID

    @ApiProperty({ description: 'Indica se a análise está desatualizada' })
    analysis_outdated: boolean;

    @ApiProperty({
        description: 'Comentários do post com suas análises',
        type: 'array',
    })
    comments: CommentWithAnalysis[];

    @ApiProperty({
        description: 'Média dos scores de todas as análises dos comentários',
        type: 'number',
        nullable: true,
        example: 0.75
    })
    average_score: number | null;
}
