import { Module } from '@nestjs/common';
import { CommentAnalysisService } from './comment-analysis.service';
import { CommentAnalysisController } from './comment-analysis.controller';

@Module({
  providers: [CommentAnalysisService],
  controllers: [CommentAnalysisController]
})
export class CommentAnalysisModule {}
