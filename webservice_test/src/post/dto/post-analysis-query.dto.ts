import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsPositive, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PostAnalysisQueryDto {
    @ApiProperty({
        required: false,
        type: Number,
        description: 'Versão específica das análises. Se não informado, retorna apenas as versões mais atuais de cada comentário.'
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    version?: number;

    @ApiProperty({
        required: false,
        type: Number,
        description: 'Score para filtrar as análises. Se não informado, retorna todas as análises.',
        example: 0.5
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    score?: number;

    @ApiProperty({
        required: false,
        type: String,
        description: 'Tipo de relacionamento da análise. Se não informado, retorna todas as análises.',
        enum: ['postItem', 'postBrand', 'beyondPost'],
        example: 'postItem'
    })
    @IsOptional()
    @IsString()
    @IsIn(['postItem', 'postBrand', 'beyondPost'])
    related_to?: string;
}
