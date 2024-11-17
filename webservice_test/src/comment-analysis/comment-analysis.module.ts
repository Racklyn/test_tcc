import { Module } from '@nestjs/common';
import { CommentAnalysisService } from './comment-analysis.service';
import { CommentAnalysisController } from './comment-analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentAnalysis } from './comment-analysis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentAnalysis])
  ],
  providers: [CommentAnalysisService],
  controllers: [CommentAnalysisController]
})
export class CommentAnalysisModule {}
