import { Comment } from 'src/comment/comment.entity';
import { Item } from 'src/item/item.entity';
import { Page } from 'src/page/page.entity';

export class CreatePostDto {
    id?: number;
    content?: string;
    summary?: string;
    post_date: Date;
    reactions?: number;
    url: string; //TODO: verificar se é necessário isso
    last_analysis?: Date;
    page: Page;
    item: Item;
    comments: Comment[];
}
