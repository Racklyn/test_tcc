import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class FindByVersionQueryDto {
    @ApiProperty({
        required: false,
        type: Number,
        description: 'Versão específica das análises. Se não informado, retorna apenas as versões mais atuais de cada comentário.',
        example: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    version?: number;

    @ApiProperty({
        required: false,
        type: Number,
        description: 'ID do post para filtrar as análises dos comentários.',
        example: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    post_id?: number;

    @ApiProperty({
        required: false,
        type: Number,
        description: 'Score para filtrar as análises.',
        example: 0.5
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    score?: number;
}
