import { CreateItemAnalysisResultDto } from './create-item-analysis-result.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateItemAnalysisResultDto extends PartialType(CreateItemAnalysisResultDto) {}
