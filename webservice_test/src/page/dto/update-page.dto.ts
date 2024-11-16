import { CreatePageDto } from './create-page.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdatePageDto extends PartialType(CreatePageDto) {}
