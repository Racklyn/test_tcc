import { ApiProperty } from '@nestjs/swagger';
import { Page } from 'src/page/page.entity';

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
    user_id: number;

    @ApiProperty({
        example: [{ id: 1, title: 'Nome da página', page_description: 'Descrição da página' }],
        nullable: true
    })
    pages: Array<{ id?: number; title: string; page_description?: string }>;
}
