import { Item } from 'src/item/item.entity';
import { Page } from 'src/page/page.entity';
import { User } from 'src/user/user.entity';

export class CreateBrandDto {
    id?: number;
    name: string;
    about: string;
    user: User;
    items: Item[];
    pages: Page[];
}
