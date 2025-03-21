import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQuery } from './query/post.query';
import { PageService } from 'src/page/page.service';
import { Comment } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly pageService: PageService,
        private readonly commentService: CommentService,
    ) {}

    async create(postDto: CreatePostDto): Promise<Post> {
        try {
            //TODO: verificar se essa é a melhor maneira de associar a uma page:
            const page = await this.pageService.findOne(postDto.page_id);
            if (!page) {
                console.log(`Page with id ${postDto.page_id} not found!`);
                throw new HttpException('Page not found!', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const post = new Post();
            post.content = postDto.content;
            post.summary = postDto.summary;
            post.post_date = postDto.post_date;
            post.reactions = postDto.reactions;
            post.url = postDto.url;
            post.newest_comment_date = this.getNewestCommentDate(postDto.comments);
            post.last_analysis = postDto.last_analysis;
            post.page = page;
            post.item = postDto.item;
             
            let savedPost = await this.postRepository.save(post);

            let savedComments = []
            for (const comm of postDto.comments) {
                comm.post = savedPost;
                const {post, ...c} = await this.commentService.create(comm);
                savedComments.push(c);
            }
            savedPost.comments = savedComments;

            return savedPost;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private getNewestCommentDate(comments: Comment[]): Date {
        if (!comments.length) return null;
    
        return comments.reduce((latest, com) => {
            if (typeof com.date === 'string') {
                com.date = new Date(com.date);
            }
            return com.date > latest ? com.date : latest
        }, new Date(0)); //TODO: verificar: começar com a data anterior (antigo "newest_comment_date")?
    }

    async findOneByDateAndPage(
        post_date: string,
        page_id: number,
    ): Promise<Post | null> {
        if (!(post_date && page_id)) return null;

        try {
            const date = new Date(post_date);

            return await this.postRepository.findOne({
                where: {
                    post_date: date,
                    page: {
                        id: page_id,
                    }
                }
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
        //query?: PostCommentsQuery
    ): Promise<Post> {
        try {
            return await this.postRepository.findOne({
                where: {
                    id: id,
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
        //TODO: verificar. Não era pra ser necessário isso. brand_id deveria vir como number
        let brand_id = query.brand_id ? +query.brand_id : undefined

        try {
            const post = await this.postRepository.find({
                where: {
                    page: {
                        brand: {
                            id: brand_id
                        }
                    }
                },
                order: {
                    [query.sort_by ?? 'updated_date'] : query.sort_order,
                },
                relations: {
                    item: true,
                }
            });
            return post;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id:number, postDto: UpdatePostDto): Promise<Post> {
        try {
            const post = await this.findOne(id);
    
            if (!post) {
            throw new NotFoundException('Post not found.');
            }
    
            // Verificação se existem novos comentários
            if (postDto.comments && postDto.comments.length > 0) {
                post.newest_comment_date = this.getNewestCommentDate(postDto.comments);
            }

            const { id: dtoId, comments: dtoComments, ...dtoWithoutIdAndComments } = postDto;
            Object.assign(post, dtoWithoutIdAndComments);
            
            const updatedPost = await this.postRepository.save(post);

            let savedComments = []
            for (const comm of dtoComments) {
                comm.post = updatedPost;
                const {post: _, ...c} = await this.commentService.create(comm);
                savedComments.push(c);
            }
            updatedPost.comments = savedComments;

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
