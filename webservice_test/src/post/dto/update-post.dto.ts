import { CreatePostDto } from './create-post.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
