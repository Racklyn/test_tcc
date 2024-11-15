import { Module } from '@nestjs/common';
import { ItemAnalysisResultService } from './item-analysis-result.service';
import { ItemAnalysisResultController } from './item-analysis-result.controller';

@Module({
  providers: [ItemAnalysisResultService],
  controllers: [ItemAnalysisResultController]
})
export class ItemAnalysisResultModule {}
