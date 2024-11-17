import { ApiProperty } from '@nestjs/swagger';
import { Brand } from 'src/brand/brand.entity';

export class CreateUserDto {
    @ApiProperty()
    id: number;

    @ApiProperty({
        //description: 'Name crawler',
        example: 'example@teste.com',
    })
    email: string;

    @ApiProperty({
        example: '12345678',
    })
    access_key: string;

    @ApiProperty({
        example: [],
        nullable: true
    })
    brands?: Brand[];
}
