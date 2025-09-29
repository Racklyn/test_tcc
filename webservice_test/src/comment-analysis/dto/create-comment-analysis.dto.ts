import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentAnalysisDto {
    @ApiProperty()
    id: number;

    @ApiProperty({
        example: 1,
        description: 'Valor da análise de sentimentos entre 0 e 1'
    })
    score: number;

    @ApiProperty({
        example: 'postItem'
    })
    related_to: 'postItem' | 'postBrand' | 'beyondPost';

    @ApiProperty({
        example: new Date()
    })
    analysis_date: Date;

    @ApiProperty({
        example: 'Analisador de sentimentos Gemini v1.0',
        required: false,
    })
    analyzer_infos?: string;

    @ApiProperty()
    comment_key: string;
}
