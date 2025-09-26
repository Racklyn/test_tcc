import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemAnalysisResult } from './item-analysis-result.entity';
import { CreateItemAnalysisResultDto } from './dto/create-item-analysis-result.dto';
import { UpdateItemAnalysisResultDto } from './dto/update-item-analysis-result.dto';
import { Item } from 'src/item/item.entity';

@Injectable()
export class ItemAnalysisResultService {
    constructor(
        @InjectRepository(ItemAnalysisResult)
        private readonly itemAnalysisResultRepository: Repository<ItemAnalysisResult>,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>
    ) {}

    async create(itemAnalysisResultDto: CreateItemAnalysisResultDto): Promise<ItemAnalysisResult> {
        try {
            const item = await this.itemRepository.findOne({
                where: { id: itemAnalysisResultDto.item_id }
            });

            if (!item) {
                throw new NotFoundException('Item not found.');
            }


            // Buscar a última versão de análise para este item
            const lastAnalysis = await this.itemAnalysisResultRepository.findOne({
                where: {
                    item: { id: item.id }
                },
                order: {
                    version: 'DESC'
                }
            });

            // Calcular a próxima versão automaticamente
            const nextVersion = lastAnalysis ? lastAnalysis.version + 1 : 1;

            const itemAnalysisResult = new ItemAnalysisResult();
            itemAnalysisResult.analysis_summary = itemAnalysisResultDto.analysis_summary;
            itemAnalysisResult.positive_points = itemAnalysisResultDto.positive_points;
            itemAnalysisResult.negative_points = itemAnalysisResultDto.negative_points;
            itemAnalysisResult.analysis_date = itemAnalysisResultDto.analysis_date || new Date();
            itemAnalysisResult.version = nextVersion; // Usar a versão calculada automaticamente
            itemAnalysisResult.item = item;
            
            return await this.itemAnalysisResultRepository.save(itemAnalysisResult);
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<ItemAnalysisResult> {
        try {
            return await this.itemAnalysisResultRepository.findOne({
                where: {
                    id: id
                },
            });
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<ItemAnalysisResult[]> {
        try {
            const itemAnalysisResult = await this.itemAnalysisResultRepository.find();
            return itemAnalysisResult;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id:number, itemAnalysisResultDto: UpdateItemAnalysisResultDto): Promise<UpdateItemAnalysisResultDto> {
        try {
            const itemAnalysisResult = await this.findOne(id);
    
            if (!itemAnalysisResult) {
            throw new NotFoundException('ItemAnalysisResult not found.');
            }
    
            const { id: dtoId, ...dtoWithoutId } = itemAnalysisResultDto;
            Object.assign(itemAnalysisResult, dtoWithoutId);
    
            const updatedItemAnalysisResult = await this.itemAnalysisResultRepository.save(itemAnalysisResult);
            return updatedItemAnalysisResult;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number) {
        try {
          await this.itemAnalysisResultRepository.delete(id);
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findLatestByItemId(itemId: number): Promise<ItemAnalysisResult> {
        try {
            const item = await this.itemRepository.findOne({
                where: { id: itemId }
            });

            if (!item) {
                throw new NotFoundException('Item not found.');
            }

            const latestAnalysis = await this.itemAnalysisResultRepository.findOne({
                where: {
                    item: { id: itemId }
                },
                order: {
                    version: 'DESC'
                },
                relations: ['item']
            });

            if (!latestAnalysis) {
                throw new NotFoundException('No analysis found for this item.');
            }

            return latestAnalysis;
        } catch(error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
