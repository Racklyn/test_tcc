import { CreateCommentAnalysisDto } from './create-comment-analysis.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCommentAnalysisDto extends PartialType(CreateCommentAnalysisDto) {}
