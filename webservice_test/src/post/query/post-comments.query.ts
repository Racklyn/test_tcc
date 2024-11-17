import { IsNumber, IsOptional } from 'class-validator';

export class PostCommentsQuery {
    @IsOptional()
    @IsNumber()
    page_id?: number;
}