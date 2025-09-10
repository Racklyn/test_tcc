import { Module } from '@nestjs/common';
import { ItemAnalysisResultService } from './item-analysis-result.service';
import { ItemAnalysisResultController } from './item-analysis-result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemAnalysisResult } from './item-analysis-result.entity';
import { Item } from 'src/item/item.entity';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemAnalysisResult, Item]),
    ItemModule
  ],
  providers: [ItemAnalysisResultService],
  controllers: [ItemAnalysisResultController]
})
export class ItemAnalysisResultModule {}
