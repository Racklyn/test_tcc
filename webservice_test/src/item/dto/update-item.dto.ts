import { CreateItemDto } from './create-item.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateItemDto extends PartialType(CreateItemDto) {}
