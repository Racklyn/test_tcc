import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PageModule } from 'src/page/page.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    PageModule,
    CommentModule,
  ],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
