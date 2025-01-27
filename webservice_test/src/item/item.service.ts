import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, IsNull, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemQuery } from './query/item.query';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>
    ) {}

    async create(itemDto: CreateItemDto): Promise<Item> {
        try {
            const item = new Item();
            item.name = itemDto.name;
            item.type = itemDto.type;
            item.description = itemDto.description;
            item.last_analysis = itemDto.last_analysis;
            item.brand = itemDto.brand;

            //TODO: verificar se faz sentido inserir essas listas:
            //item.item_analysis_result = itemDto.item_analysis_result ?? [];
            item.posts = itemDto.posts ?? [];
            
            return await this.itemRepository.save(item);
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<Item> {
        try {
            return await this.itemRepository.findOne({
                where: {
                    id: id
                },
            });
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(
        query?: ItemQuery
    ): Promise<Item[]> {
        try {
            const item = await this.itemRepository.find({
                where: {
                    brand: {
                        id: query.brand_id,
                    },
                    type: query.type,
                },
                order: {
                    [query.sort_by ?? 'updated_date'] : query.sort_order ?? 'ASC', //TODO: verificar
                }
            });
            return item;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAllWithStatistics(
        query?: ItemQuery
        //TODO: incluir versão da análise desejada? OU retornar sempre a última?
    ): Promise<Item[]> {
        //TODO: verificar se funciona quando sort_by e sort_order são undefined
        try {
            const item = await this.itemRepository.find({
                where: {
                    brand: {
                        id: query.brand_id,
                    },
                    type: query.type,
                    item_analysis_result: Not(IsNull()),
                    posts: {
                        last_analysis: Not(IsNull()), //TODO: verificar se é necessário
                    }
                },
                order: {
                    [query.sort_by ?? 'updated_date'] : query.sort_order ?? 'ASC', //TODO: verificar
                },
                relations: {
                    item_analysis_result: true,
                    posts: {
                        comments: {
                            comment_analysis: true,
                        }
                    }
                }
            });

            //TODO: ajustar para retornar um formato já contendo as estatísticas
            return item;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id:number, itemDto: UpdateItemDto): Promise<UpdateItemDto> {
        try {
            const item = await this.findOne(id);
    
            if (!item) {
            throw new NotFoundException('Item not found.');
            }
    
            const { id: dtoId, ...dtoWithoutId } = itemDto;
            Object.assign(item, dtoWithoutId);
    
            const updatedItem = await this.itemRepository.save(item);
            return updatedItem;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number) {
        try {
          await this.itemRepository.delete(id);
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
