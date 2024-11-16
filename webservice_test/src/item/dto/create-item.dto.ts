import { Brand } from 'src/brand/brand.entity';
import { ItemAnalysisResult } from 'src/item-analysis-result/item-analysis-result.entity';
import { Post } from 'src/post/post.entity';

export class CreateItemDto {
    id?: number;
    name: string;
    type: 'PRODUCT' | 'SERVICE';
    description: string;
    last_analysis?: Date;
    brand: Brand;
    item_analysis_result: ItemAnalysisResult[];
    posts: Post[];
}
