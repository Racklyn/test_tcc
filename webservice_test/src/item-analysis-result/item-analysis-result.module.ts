import { Module } from '@nestjs/common';
import { ItemAnalysisResultService } from './item-analysis-result.service';
import { ItemAnalysisResultController } from './item-analysis-result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemAnalysisResult } from './item-analysis-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemAnalysisResult])
  ],
  providers: [ItemAnalysisResultService],
  controllers: [ItemAnalysisResultController]
})
export class ItemAnalysisResultModule {}
