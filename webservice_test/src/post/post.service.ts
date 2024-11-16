import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) {}

    async create(postDto: CreatePostDto): Promise<Post> {
        try {
            const post = new Post();
            post.content = postDto.content;
            post.summary = postDto.summary;
            post.post_date = postDto.post_date;
            post.reactions = postDto.reactions;
            post.url = postDto.url;
            post.last_analysis = postDto.last_analysis;
            post.page = postDto.page;
            post.item = postDto.item;
            post.comments = postDto.comments;
            
            return await this.postRepository.save(post);
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<Post> {
        try {
            return await this.postRepository.findOne({
                where: {
                    id: id
                },
            });
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<Post[]> {
        try {
            const post = await this.postRepository.find();
            return post;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id:number, postDto: UpdatePostDto): Promise<UpdatePostDto> {
        try {
            const post = await this.findOne(id);
    
            if (!post) {
            throw new NotFoundException('Post not found.');
            }
    
            const { id: dtoId, ...dtoWithoutId } = postDto;
            Object.assign(post, dtoWithoutId);
    
            const updatedPost = await this.postRepository.save(postDto);
            return updatedPost;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number) {
        try {
          await this.postRepository.delete(id);
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
