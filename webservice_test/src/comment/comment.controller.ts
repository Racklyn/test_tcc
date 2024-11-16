import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

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

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.commentService.findOne(id);
    }

    @Get()
    async findAll(){
        const comments = await this.commentService.findAll();
        return comments;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return await this.commentService.update(+id, updateCommentDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.commentService.remove(+id);
    }
}
