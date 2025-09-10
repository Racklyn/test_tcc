import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { DefaultQueryParams } from 'src/common/query/default.query';

export class ItemQuery extends DefaultQueryParams {
    @IsOptional()
    @IsNumberString()
    brand_id?: string;
    @IsOptional()
    @IsString()
    type?: 'product' | 'service';
}