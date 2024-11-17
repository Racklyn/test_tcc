import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DefaultQueryParams } from 'src/common/query/default.query';

export class ItemQuery extends DefaultQueryParams {
    @IsOptional()
    @IsNumber()
    brand_id?: number;
    @IsOptional()
    @IsString()
    type?: 'PRODUCT' | 'SERVICE';
}