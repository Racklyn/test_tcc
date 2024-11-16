import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService
    ) { }

    @Post()
    async create(@Body() post: CreatePostDto) {
        const created_post = await this.postService.create(post);
        return created_post;
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.postService.findOne(id);
    }

    @Get()
    async findAll(){
        const posts = await this.postService.findAll();
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
        return this.postService.remove(+id);
    }
}
