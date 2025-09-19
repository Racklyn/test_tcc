import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { Brand } from 'src/brand/brand.entity';
import { CommentAnalysis } from 'src/comment-analysis/comment-analysis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, Brand, CommentAnalysis])
  ],
  providers: [ItemService],
  controllers: [ItemController],
  exports: [ItemService]
})
export class ItemModule {}
