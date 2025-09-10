import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CommentAnalysisService } from './comment-analysis.service';
import { CreateCommentAnalysisDto } from './dto/create-comment-analysis.dto';
import { UpdateCommentAnalysisDto } from './dto/update-comment-analysis.dto';
import { FindByVersionQueryDto } from './dto/find-by-version-query.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('commentAnalysis')
@Controller('commentAnalysis')
export class CommentAnalysisController {
    constructor(
        private readonly commentAnalysisService: CommentAnalysisService
    ) { }

    @Post()
    async create(@Body() commentAnalysis: CreateCommentAnalysisDto) {
        const created_commentAnalysis = await this.commentAnalysisService.create(commentAnalysis);
        return created_commentAnalysis;
    }

    @Get()
    async findAll(){
        const commentAnalysis = await this.commentAnalysisService.findAll();
        return commentAnalysis;
    }

    @Get('byVersion')
    async findAllByVersion(@Query() query: FindByVersionQueryDto){
        const commentAnalysis = await this.commentAnalysisService.findAllByVersion(
            query.version, 
            query.post_id, 
            query.score
        );
        return commentAnalysis;
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.commentAnalysisService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCommentAnalysisDto: UpdateCommentAnalysisDto,
    ) {
        return await this.commentAnalysisService.update(+id, updateCommentAnalysisDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.commentAnalysisService.remove(+id);
    }
}
