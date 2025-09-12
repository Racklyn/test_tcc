import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQuery } from './query/post.query';
import { PostResponseDto } from './dto/post-response.dto';
import { PageService } from 'src/page/page.service';
import { Comment } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';
import { ItemService } from 'src/item/item.service';
import { CommentAnalysis } from 'src/comment-analysis/comment-analysis.entity';

// Tipo para CommentAnalysis sem a propriedade comment (para evitar referência circular)
type CommentAnalysisWithoutComment = Omit<CommentAnalysis, 'comment'>;

// Tipo para Comment com comment_analysis sem referência circular
type CommentWithAnalysis = Omit<Comment, 'comment_analysis'> & {
    comment_analysis: CommentAnalysisWithoutComment[];
};


@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(CommentAnalysis)
        private readonly commentAnalysisRepository: Repository<CommentAnalysis>,
        private readonly pageService: PageService,
        private readonly commentService: CommentService,
        private readonly itemService: ItemService,
    ) {}

    async create(postDto: CreatePostDto): Promise<Post> {
        try {
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

            if (postDto.item_id) {
                const item = await this.itemService.findOne(postDto.item_id);
                if (!item) {
                    console.log(`Item with id ${postDto.item_id} not found!`);
                    throw new HttpException('Item not found!', HttpStatus.INTERNAL_SERVER_ERROR);
                }
                post.item = item;
            }
            
             
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
            const post = await this.postRepository.findOne({
                where: {
                    id: id
                }
            });

            if (!post) {
                throw new NotFoundException('Post not found.');
            }

            return post;
        } catch(error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOneWithComments(
        id: number,
        //query?: PostCommentsQuery
    ): Promise<PostResponseDto> {
        try {
            const post = await this.postRepository.findOne({
                where: {
                    id: id,
                },
                relations: {
                    comments: {
                        comment_analysis: true
                    },
                    page: true, // TODO: verificar se é necessário
                }
            });

            if (!post) {
                throw new NotFoundException('Post not found.');
            }

            return this.convertToResponseDto(post);
        } catch(error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(query?: PostQuery): Promise<Post[]> {
        //TODO: verificar. Não era pra ser necessário isso. brand_id deveria vir como number
        let brand_id = query.brand_id ? +query.brand_id : undefined
        let since_date = query.since_date ? new Date(query.since_date) : undefined

        try {
            // Construindo o where dinamicamente
            const whereCondition: any = {
                page: {
                    brand: {
                        id: brand_id
                    }
                }
            };

            // Adicionar a condição de data apenas se since_date existir
            if (since_date) {
                whereCondition.post_date = MoreThanOrEqual(since_date);
            }

            const posts = await this.postRepository.find({
                where: whereCondition,
                order: {
                    [query.sort_by ?? 'updated_date'] : query.sort_order,
                },
                relations: {
                    item: true,
                    comments: true
                }
            });

            return posts;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id:number, postDto: UpdatePostDto): Promise<Post> {
        try {
            const post = await this.postRepository.findOne({
                where: { id },
                relations: {
                    comments: {
                        comment_analysis: true
                    }
                }
            });
    
            if (!post) {
            throw new NotFoundException('Post not found.');
            }
    
            // Verificação se existem novos comentários
            if (postDto.comments && postDto.comments.length > 0) {
                post.newest_comment_date = this.getNewestCommentDate(postDto.comments);
            }

            // Verificação e atualização do item_id
            if (postDto.item_id) {
                const item = await this.itemService.findOne(postDto.item_id);
                if (!item) {
                    console.log(`Item with id ${postDto.item_id} not found!`);
                    throw new HttpException('Item not found!', HttpStatus.INTERNAL_SERVER_ERROR);
                }
                post.item = item;
            }

            const { id: dtoId, comments: dtoComments, item_id, ...dtoWithoutIdAndComments } = postDto;
            Object.assign(post, dtoWithoutIdAndComments);
            
            const updatedPost = await this.postRepository.save(post);

            if (dtoComments && dtoComments.length > 0) {
                let savedComments = []
                for (const comm of dtoComments) {
                    comm.post = updatedPost;
                    const {post: _, ...c} = await this.commentService.create(comm);
                    savedComments.push(c);
                }
                updatedPost.comments = savedComments;
            }
            
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

    async findOneWithAnalysis(
        id: number,
        version?: number,
        score?: number,
        related_to?: string
    ): Promise<PostResponseDto & { comments: CommentWithAnalysis[] }> {
        try {
            // Buscar o post com seus comentários
            const post = await this.postRepository.findOne({
                where: { id },
                relations: {
                    comments: true
                }
            });

            if (!post) {
                throw new NotFoundException('Post not found.');
            }

            // Buscar análises dos comentários usando QueryBuilder do TypeORM
            const commentKeys = post.comments.map(comment => comment.key);
            
            const queryBuilder = this.commentAnalysisRepository
                .createQueryBuilder('ca')
                .leftJoinAndSelect('ca.comment', 'comment')
                .where('comment.key IN (:...commentKeys)', { commentKeys });

            // Filtro por versão específica
            if (version !== undefined && version !== null && !isNaN(version) && version > 0) {
                queryBuilder.andWhere('ca.version = :version', { version });
            } else {
                // Retorna apenas as versões mais atuais de cada comentário
                const subQuery = this.commentAnalysisRepository
                    .createQueryBuilder('ca2')
                    .select('MAX(ca2.version)')
                    .leftJoin('ca2.comment', 'comment2')
                    .where('comment2.key = comment.key');
                
                queryBuilder.andWhere(`ca.version = (${subQuery.getQuery()})`);
            }

            // Filtro por score
            if (score !== undefined && score !== null && !isNaN(score)) {
                queryBuilder.andWhere('ca.score = :score', { score });
            }

            // Filtro por related_to
            if (related_to) {
                queryBuilder.andWhere('ca.related_to = :related_to', { related_to });
            }

            queryBuilder.orderBy('ca.id', 'ASC');

            const analyses = await queryBuilder.getMany();

            // Adicionar as análises aos comentários correspondentes e filtrar comentários sem análises
            const commentsWithAnalysis: CommentWithAnalysis[] = post.comments
                .map(comment => {
                    const commentAnalyses: CommentAnalysisWithoutComment[] = analyses
                        .filter(analysis => analysis.comment.key === comment.key)
                        .map(analysis => {
                            // Remover a propriedade comment do objeto de análise para evitar referência circular
                            const { comment: _, ...analysisWithoutComment } = analysis;
                            return analysisWithoutComment;
                        });
                    
                    return {
                        ...comment,
                        comment_analysis: commentAnalyses
                    } as CommentWithAnalysis;
                })
                .filter(comment => comment.comment_analysis.length > 0);

            // Atribuir os comentários com análises ao post
            (post as any).comments = commentsWithAnalysis;

            // Converter para PostResponseDto
            const responseDto = this.convertToResponseDto(post);
            (responseDto as any).comments = commentsWithAnalysis;

            return responseDto;
        } catch(error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Verifica se a análise está desatualizada verificando se algum comentário não possui análises
     */
    private isAnalysisOutdated(post: Post): boolean {
        if (!post.comments || post.comments.length === 0) {
            return false;
        }

        return post.comments.some(comment => 
            !comment.comment_analysis || comment.comment_analysis.length === 0
        );
    }

    /**
     * Converte um Post para PostResponseDto incluindo o campo analysis_outdated
     */
    private convertToResponseDto(post: Post): PostResponseDto {
        const responseDto = new PostResponseDto();
        Object.assign(responseDto, post);
        responseDto.analysis_outdated = this.isAnalysisOutdated(post);
        return responseDto;
    }
}
