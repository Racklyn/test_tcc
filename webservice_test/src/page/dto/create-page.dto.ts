import { ApiProperty } from '@nestjs/swagger';
import { Brand } from 'src/brand/brand.entity';
import { Post } from 'src/post/post.entity';

export class CreatePageDto {
    @ApiProperty()
    id: number;

    @ApiProperty({
        example: 'SamsungBrasil'
    })
    title: string;

    @ApiProperty({
        example: 'Página oficial da Samsung no Brasil',
        nullable: true
    })
    page_description?: string;

    @ApiProperty()
    brand: Brand;

    @ApiProperty({
        example: [],
        nullable: true
    })
    posts?: Post[];
}
