import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../user/user.entity';
import { Brand } from '../brand/brand.entity';
import { Item } from '../item/item.entity';
import { ItemAnalysisResult } from '../item-analysis-result/item-analysis-result.entity';
import { Page } from '../page/page.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { CommentAnalysis } from '../comment-analysis/comment-analysis.entity';

// Carrega as variáveis de ambiente
ConfigModule.forRoot();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_DATABASE || 'brand_analyzer',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  entities: [User, Brand, Item, ItemAnalysisResult, Page, Post, Comment, CommentAnalysis],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // Sempre false em produção
  logging: process.env.NODE_ENV === 'development',
});
