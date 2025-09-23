import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { DefaultQueryParams } from 'src/common/query/default.query';

export class PostQuery extends DefaultQueryParams {
    @IsOptional()
    @IsNumberString() //@IsNumber() //TODO: verificar isso. Era para funcionar com number
    brand_id?: string;

    @IsOptional()
    @IsString()
    since_date?: string;
}   