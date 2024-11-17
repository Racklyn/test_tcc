import { IsOptional, IsString } from 'class-validator';

export class DefaultQueryParams {
    @IsString()
    @IsOptional()
    sort_by?: string;
    @IsString()
    sort_order: 'ASC' | 'DESC' = 'ASC'; //TODO: verificar se a atribuição funciona
}