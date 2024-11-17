import { IsNumberString } from 'class-validator';
import { DefaultQueryParams } from 'src/common/query/default.query';

export class BrandQuery extends DefaultQueryParams {
    @IsNumberString()
    user_id: string;
}