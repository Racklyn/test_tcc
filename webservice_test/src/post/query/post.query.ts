import { IsNumber, IsOptional } from 'class-validator';
import { DefaultQueryParams } from 'src/common/query/default.query';

export class PostQuery extends DefaultQueryParams {
    @IsOptional()
    @IsNumber()
    brand_id?: number;
}