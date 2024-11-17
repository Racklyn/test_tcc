import { ApiProperty } from '@nestjs/swagger';
import { Item } from 'src/item/item.entity';
import { Page } from 'src/page/page.entity';
import { User } from 'src/user/user.entity';

export class CreateBrandDto {
    @ApiProperty()
    id: number;

    @ApiProperty({
        example: 'Samsung'
    })
    name: string;

    @ApiProperty({
        example: 'Marca de celulares, notebooks, TVs e outros eletrônicos.'
    })
    about: string;

    @ApiProperty()
    user: User;

    @ApiProperty({
        example: [],
        nullable: true
    })
    items?: Item[];

    @ApiProperty({
        example: [],
        nullable: true
    })
    pages?: Page[];
}
