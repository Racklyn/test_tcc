import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) { }

    @Post()
    async create(@Body() comment: CreateCommentDto) {
        const created_comment = await this.commentService.create(comment);
        return created_comment;
    }

    @Get(':key')
    findOne(@Param('key') key: string) {
        return this.commentService.findOne(key);
    }

    @Get()
    async findAll(){
        const comments = await this.commentService.findAll();
        return comments;
    }

    // @Patch(':key')
    // async update(
    //     @Param('key') key: string,
    //     @Body() updateCommentDto: UpdateCommentDto,
    // ) {
    //     return await this.commentService.update(key, updateCommentDto);
    // }

    @Delete(':key')
    async remove(@Param('key') key: string) {
        return this.commentService.remove(key);
    }
}
