import { ApiProperty } from '@nestjs/swagger';
import { Item } from '../item.entity';

export class ItemResponseDto extends Item {
    @ApiProperty({
        description: 'Indica se o item precisa ser atualizado/sincronizado',
        example: true,
        default: false
    })
    outdated: boolean;
}
