import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentAnalysis } from './comment-analysis.entity';
import { CreateCommentAnalysisDto } from './dto/create-comment-analysis.dto';
import { UpdateCommentAnalysisDto } from './dto/update-comment-analysis.dto';

@Injectable()
export class CommentAnalysisService {
    constructor(
        @InjectRepository(CommentAnalysis)
        private readonly commentAnalysisRepository: Repository<CommentAnalysis>
    ) {}

    async create(commentAnalysisDto: CreateCommentAnalysisDto): Promise<CommentAnalysis> {
        try {
            const commentAnalysis = new CommentAnalysis();
            commentAnalysis.score = commentAnalysisDto.score;
            commentAnalysis.version = commentAnalysisDto.version;
            commentAnalysis.related_to = commentAnalysisDto.related_to;
            commentAnalysis.analysis_date = commentAnalysisDto.analysis_date;
            commentAnalysis.comment = commentAnalysisDto.comment;
            
            return await this.commentAnalysisRepository.save(commentAnalysis);
        } catch(error) {
            console.log(error);
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

    async update(id:number, commentAnalysisDto: UpdateCommentAnalysisDto): Promise<UpdateCommentAnalysisDto> {
        try {
            const commentAnalysis = await this.findOne(id);
    
            if (!commentAnalysis) {
            throw new NotFoundException('CommentAnalysis not found.');
            }
    
            const { id: dtoId, ...dtoWithoutId } = commentAnalysisDto;
            Object.assign(commentAnalysis, dtoWithoutId);
    
            const updatedCommentAnalysis = await this.commentAnalysisRepository.save(commentAnalysisDto);
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
