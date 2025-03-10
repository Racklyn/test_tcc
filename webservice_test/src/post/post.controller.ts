import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQuery } from './query/post.query';
//import { PostCommentsQuery } from './query/post-comments.query'; //TODO: remover se não for ser usada
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService
    ) { }

    @Post('createOrUpdate')
    async create(@Body() post: CreatePostDto) {
        const created_post = await this.postService.createOrUpdate(post);
        return created_post;
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.postService.findOne(id);
    }

    @Get(':id/withComments')
    //@ApiQuery({ name: 'page_id', required: false  })
    async findOneWithComments(
        @Param('id') id: number,
        //@Query() query: PostCommentsQuery  //TODO: verificar se é necessário
    ) {
        return this.postService.findOneWithComments(id);
    }

    @Get()
    @ApiQuery({ name: 'brand_id', required: false }) //, type: Number //TODO: verificar 'type' aqui
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
