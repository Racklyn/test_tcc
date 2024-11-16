import { Brand } from 'src/brand/brand.entity';
import { Post } from 'src/post/post.entity';

export class CreatePageDto {
    id?: number;
    title: string;
    page_description?: string;
    brand: Brand;
    posts: Post[];
}
