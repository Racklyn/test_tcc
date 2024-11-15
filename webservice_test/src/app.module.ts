import { Module } from '@nestjs/common';  
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { BrandModule } from './brand/brand.module';
import { ItemModule } from './item/item.module';
import { ItemAnalysisResultModule } from './item-analysis-result/item-analysis-result.module';
import { PageModule } from './page/page.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { CommentAnalysisModule } from './comment-analysis/comment-analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // indica que esse é o módulo principal de configuração
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: true,
      logging: false,
      //migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
    }),
    UsersModule,
    BrandModule,
    ItemModule,
    ItemAnalysisResultModule,
    PageModule,
    PostModule,
    CommentModule,
    CommentAnalysisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
