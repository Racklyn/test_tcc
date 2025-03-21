import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { generateHash } from 'src/utils/hash-generator';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>
    ) {}

    async create(commentDto: CreateCommentDto): Promise<Comment> {
        try {
            const comment = new Comment();
            const hashKey = generateHash(commentDto.text + commentDto.date.toString() + commentDto.autor + commentDto.post.id);
            
            comment.key = hashKey;
            comment.text = commentDto.text;
            comment.date = commentDto.date;
            comment.reactions = commentDto.reactions;
            comment.post = commentDto.post;
            
            return await this.commentRepository.save(comment);
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(key: string): Promise<Comment> {
        try {
            return await this.commentRepository.findOne({
                where: {
                    key: key
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

    // async update(key:string, commentDto: UpdateCommentDto): Promise<UpdateCommentDto> {
    //     try {
    //         const comment = await this.findOne(key);

    //         if (!comment) {
    //         throw new NotFoundException('Comment not found.');
    //         }
            
    //         const { key: dtoKey, ...dtoWithoutKey } = commentDto;
    //         Object.assign(comment, dtoWithoutKey);
    
    //         const updatedComment = await this.commentRepository.save(comment);
    //         return updatedComment;
    //     } catch(error) {
    //         console.log(error);
    //         throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    async remove(key: string) {
        try {
          await this.commentRepository.delete(key);
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
