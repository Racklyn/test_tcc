import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQuery } from './query/post.query';
import { PostAnalysisQueryDto } from './dto/post-analysis-query.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService
    ) { }

    @Post('create')
    async create(@Body() post: CreatePostDto) {
        const created_post = await this.postService.create(post);
        return created_post;
    }

    @Get('findByDateAndPage')
    @ApiQuery({ name: 'post_date', example: '2025-03-08T09:30Z' })
    @ApiQuery({ name: 'page_id' })
    async findOneByDateAndPage(
        @Query('post_date') post_date: string,
        @Query('page_id') page_id: number,
    ) {
        return this.postService.findOneByDateAndPage(post_date, page_id);
    }

    @Get(':id/withComments')
    async findOneWithComments(
        @Param('id') id: number,
    ) {
        return this.postService.findOneWithComments(id);
    }

    @Get(':id/withAnalysis')
    async findOneWithAnalysis(
        @Param('id') id: number,
        @Query() query: PostAnalysisQueryDto,
    ) {
        return this.postService.findOneWithAnalysis(id, query.version, query.score, query.related_to);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.postService.findOne(id);
    }

    @Get()
    @ApiQuery({ name: 'brand_id', required: false })
    @ApiQuery({ name: 'since_date', required: false, example: '2025-03-08T00:00Z' })
    @ApiQuery({ name: 'sort_by', required: false })
    @ApiQuery({ name: 'sort_order', required: false })
    async findAll(@Query() query: PostQuery){
        const posts = await this.postService.findAll(query);
        return posts;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        return await this.postService.update(+id, updatePostDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.postService.remove(+id);
    }
}
