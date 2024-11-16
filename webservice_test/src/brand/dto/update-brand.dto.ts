import { CreateBrandDto } from './create-brand.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
