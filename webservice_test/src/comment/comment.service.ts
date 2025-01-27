import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>
    ) {}

    async create(commentDto: CreateCommentDto): Promise<Comment> {
        try {
            const comment = new Comment();
            comment.text = commentDto.text;
            comment.date = commentDto.date;
            comment.reactions = commentDto.reactions;
            comment.post = commentDto.post;

            //TODO: verificar se faz sentido inserir essa lista:
            //comment.comment_analysis = commentDto.comment_analysis ?? [];
            
            return await this.commentRepository.save(comment);
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<Comment> {
        try {
            return await this.commentRepository.findOne({
                where: {
                    id: id
                },
            });
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<Comment[]> {
        try {
            const comment = await this.commentRepository.find();
            return comment;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id:number, commentDto: UpdateCommentDto): Promise<UpdateCommentDto> {
        try {
            const comment = await this.findOne(id);
    
            if (!comment) {
            throw new NotFoundException('Comment not found.');
            }
    
            const { id: dtoId, ...dtoWithoutId } = commentDto;
            Object.assign(comment, dtoWithoutId);
    
            const updatedComment = await this.commentRepository.save(comment);
            return updatedComment;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number) {
        try {
          await this.commentRepository.delete(id);
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
