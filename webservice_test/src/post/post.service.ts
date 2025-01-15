import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQuery } from './query/post.query';
import { PostCommentsQuery } from './query/post-comments.query';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) {}

    async createOrUpdate(postDto: CreatePostDto): Promise<Post> {
        try {
            //TODO: verificar se funciona: verificação se publicação já existe ou é uma nova com base na 'post_date' e 'page'
            const existingPost = await this.findOneByDateAndPage(postDto.post_date, postDto.page.id);

            if (existingPost) {
                return await this.update(existingPost.id, postDto) as Post; //TODO: verificar
            } else {
                const post = new Post();
                post.content = postDto.content;
                post.summary = postDto.summary;
                post.post_date = postDto.post_date;
                post.reactions = postDto.reactions;
                post.url = postDto.url;
                post.last_analysis = postDto.last_analysis;
                post.page = postDto.page;
                post.item = postDto.item;
                post.comments = postDto.comments ?? [];
                
                return await this.postRepository.save(post);
            }

        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async findOneByDateAndPage(
        post_date: Date,
        page_id: number,
    ): Promise<Post | null> {
        try {
            return await this.postRepository.findOne({
                where: {
                    post_date: post_date,
                    page: {
                        id: page_id,
                    }
                },
            });
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

    async findOneWithComments(
        id: number,
        query?: PostCommentsQuery
    ): Promise<Post> {
        try {
            return await this.postRepository.findOne({
                where: {
                    id: id,
                    page: {
                        id: query.page_id,
                    }
                },
                relations: {
                    comments: true,
                    page: true, // TODO: verificar se é necessário
                }
            });
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(query?: PostQuery): Promise<Post[]> {
        try {
            const post = await this.postRepository.find({
                where: {
                    page: {
                        brand: {
                            id: query.brand_id
                        }
                    }
                },
                order: {
                    [query.sort_by ?? 'updated_date'] : query.sort_order ?? 'ASC', //TODO: verificar se funciona
                },
                relations: {
                    item: true, //TODO: verificar se é necessário
                }
            });
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
    
            const updatedPost = await this.postRepository.save(post);
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
