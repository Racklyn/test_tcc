import { Module, forwardRef } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { Brand } from 'src/brand/brand.entity';
import { CommentAnalysis } from 'src/comment-analysis/comment-analysis.entity';
import { ItemAnalysisResultModule } from 'src/item-analysis-result/item-analysis-result.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, Brand, CommentAnalysis]),
    forwardRef(() => ItemAnalysisResultModule)
  ],
  providers: [ItemService],
  controllers: [ItemController],
  exports: [ItemService]
})
export class ItemModule {}
