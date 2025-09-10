import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { CommentAnalysis } from 'src/comment-analysis/comment-analysis.entity';
import { PageModule } from 'src/page/page.module';
import { CommentModule } from 'src/comment/comment.module';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, CommentAnalysis]),
    PageModule,
    CommentModule,
    ItemModule,
  ],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
