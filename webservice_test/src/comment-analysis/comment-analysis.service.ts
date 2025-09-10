import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentAnalysis } from './comment-analysis.entity';
import { CreateCommentAnalysisDto } from './dto/create-comment-analysis.dto';
import { UpdateCommentAnalysisDto } from './dto/update-comment-analysis.dto';
import { Comment } from 'src/comment/comment.entity';
import { DEFAULT_ANALYZER_INFOS } from 'src/common/defaults';

@Injectable()
export class CommentAnalysisService {
    constructor(
        @InjectRepository(CommentAnalysis)
        private readonly commentAnalysisRepository: Repository<CommentAnalysis>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>
    ) {}

    async create(commentAnalysisDto: CreateCommentAnalysisDto): Promise<CommentAnalysis> {
        try {
            const comment = await this.commentRepository.findOne({
                where: {
                    key: commentAnalysisDto.comment_key
                }
            });

            if (!comment) {
                throw new NotFoundException('Comment not found.');
            }

            // Buscar a última versão de análise para este comentário
            const lastAnalysis = await this.commentAnalysisRepository.findOne({
                where: {
                    comment: { key: commentAnalysisDto.comment_key }
                },
                order: {
                    version: 'DESC'
                }
            });

            // Calcular a próxima versão automaticamente
            const nextVersion = lastAnalysis ? lastAnalysis.version + 1 : 1;

            const commentAnalysis = new CommentAnalysis();
            commentAnalysis.score = commentAnalysisDto.score;
            commentAnalysis.version = nextVersion;
            commentAnalysis.related_to = commentAnalysisDto.related_to;
            commentAnalysis.analysis_date = commentAnalysisDto.analysis_date;
            commentAnalysis.analyzer_infos = commentAnalysisDto.analyzer_infos || DEFAULT_ANALYZER_INFOS;
            
            commentAnalysis.comment = comment;
            
            return await this.commentAnalysisRepository.save(commentAnalysis);
        } catch(error) {
            console.log(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<CommentAnalysis> {
        try {
            return await this.commentAnalysisRepository.findOne({
                where: {
                    id: id
                },
            });
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<CommentAnalysis[]> {
        try {
            const commentAnalysis = await this.commentAnalysisRepository.find();
            return commentAnalysis;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAllByVersion(
        version?: number, 
        post_id?: number, 
        score?: number
    ): Promise<CommentAnalysis[]> {
        try {
            const queryBuilder = this.commentAnalysisRepository
                .createQueryBuilder('ca')
                .leftJoinAndSelect('ca.comment', 'comment')
                .leftJoinAndSelect('comment.post', 'post');

            // Filtro por versão específica
            if (version !== undefined && version !== null && !isNaN(version) && version > 0) {
                queryBuilder.andWhere('ca.version = :version', { version });
            } else {
                // Retorna apenas as versões mais atuais de cada comentário
                const subQuery = this.commentAnalysisRepository
                    .createQueryBuilder('ca2')
                    .select('MAX(ca2.version)')
                    .leftJoin('ca2.comment', 'comment2')
                    .where('comment2.post_id = comment.post_id');
                
                queryBuilder.andWhere(`ca.version = (${subQuery.getQuery()})`);
            }

            // Filtro por post_id
            if (post_id !== undefined && post_id !== null && !isNaN(post_id) && post_id > 0) {
                queryBuilder.andWhere('post.id = :post_id', { post_id });
            }

            // Filtro por score
            if (score !== undefined && score !== null && !isNaN(score)) {
                queryBuilder.andWhere('ca.score = :score', { score });
            }

            const commentAnalysis = await queryBuilder.getMany();
            return commentAnalysis;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id:number, commentAnalysisDto: UpdateCommentAnalysisDto): Promise<UpdateCommentAnalysisDto> {
        try {
            const commentAnalysis = await this.findOne(id);
    
            if (!commentAnalysis) {
            throw new NotFoundException('CommentAnalysis not found.');
            }
    
            const { id: dtoId, ...dtoWithoutId } = commentAnalysisDto;
            Object.assign(commentAnalysis, dtoWithoutId);
    
            const updatedCommentAnalysis = await this.commentAnalysisRepository.save(commentAnalysis);
            return updatedCommentAnalysis;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number) {
        try {
          await this.commentAnalysisRepository.delete(id);
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
