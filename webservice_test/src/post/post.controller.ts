import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQuery } from './query/post.query';
import { PostCommentsQuery } from './query/post-comments.query';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService
    ) { }

    @Post()
    async create(@Body() post: CreatePostDto) {
        const created_post = await this.postService.createOrUpdate(post);
        return created_post;
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.postService.findOne(id);
    }

    @Get(':id/withComments')
    @ApiQuery({ name: 'page_id', required: false  })
    async findOneWithComments(
        @Param('id') id: number,
        @Query() query: PostCommentsQuery
    ) {
        return this.postService.findOneWithComments(id, query);
    }

    @Get()
    @ApiQuery({ name: 'brand_id' })
    @ApiQuery({ name: 'sort_by' })
    @ApiQuery({ name: 'sort_order' })
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
