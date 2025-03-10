import { IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { DefaultQueryParams } from 'src/common/query/default.query';

export class PostQuery extends DefaultQueryParams {
    @IsOptional()
    @IsNumberString() //@IsNumber() //TODO: verificar isso. Era para funcionar com number
    brand_id?: number;
}