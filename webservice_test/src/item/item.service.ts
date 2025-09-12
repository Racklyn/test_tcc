import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, IsNull, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemResponseDto } from './dto/item-response.dto';
import { ItemQuery } from './query/item.query';
import { Brand } from 'src/brand/brand.entity';

@Injectable()
export class ItemService {

    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,

        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>
    ) {}

    async create(itemDto: CreateItemDto): Promise<Item> {
        const brand = await this.brandRepository.findOne({
            where: {
                id: itemDto.brand_id
            }
        });

        if (!brand) {
            throw new NotFoundException('Brand not found.');
        }
    
        try {
            const item = new Item();
            item.name = itemDto.name;
            item.type = itemDto.type;
            item.description = itemDto.description;
            item.last_sync = new Date(Date.now());
            item.block_name_from_updates = itemDto.block_name_from_updates;
            item.brand = brand;
            item.posts = itemDto.posts ?? [];
            
            return await this.itemRepository.save(item);
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<ItemResponseDto> {
        try {
            const item = await this.itemRepository.findOne({
                where: {
                    id: id
                },
                relations: {
                    posts: true,
                    brand: true
                }
            });
            
            if (!item) {
                return null;
            }
            
            return this.toItemResponseDto(item);
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(
        query?: ItemQuery
    ): Promise<ItemResponseDto[]> {
        try {
            const items = await this.itemRepository.find({
                where: {
                    brand: {
                        id: query.brand_id ? +query.brand_id : undefined,
                    },
                    type: query.type,
                },
                order: {
                    [query.sort_by ?? 'updated_date'] : query.sort_order ?? 'ASC',
                },
                relations: {
                    posts: true
                }
            });
            return items.map(item => this.toItemResponseDto(item));
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAllWithPosts(
        query?: ItemQuery
    ): Promise<ItemResponseDto[]> {
        try {
            const items = await this.itemRepository.find({
                where: {
                    brand: {
                        id: +query.brand_id,
                    },
                    type: query.type,
                },
                order: {
                    [query.sort_by ?? 'updated_date'] : query.sort_order ?? 'ASC', //TODO: verificar
                },
                relations: {
                    posts: true,
                }
            });
            return items.map(item => this.toItemResponseDto(item));
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAllWithStatistics(
        query?: ItemQuery
        //TODO: incluir versão da análise desejada? OU retornar sempre a última?
    ): Promise<ItemResponseDto[]> {
        //TODO: verificar se funciona quando sort_by e sort_order são undefined
        try {
            const items = await this.itemRepository.find({
                where: {
                    brand: {
                        id: +query.brand_id,
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
            return items.map(item => this.toItemResponseDto(item));;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id:number, itemDto: UpdateItemDto): Promise<UpdateItemDto> {
        try {
            const item = await this.itemRepository.findOne({
                where: {
                    id: id
                }
            });
    
            if (!item) {
            throw new NotFoundException('Item not found.');
            }

            // Remove o campo name do DTO se o item atual tem block_name_from_updates = true
            const { id: dtoId, name, ...dtoWithoutIdAndName } = itemDto;
            
            // Aplica as atualizações, mas preserva o name original se block_name_from_updates for true
            Object.assign(item, dtoWithoutIdAndName);
            
            // Só atualiza o name se o item atual não tiver block_name_from_updates = true
            if (!item.block_name_from_updates && name !== undefined) {
                item.name = name;
            }
    
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


    /**
     * Calcula se um item está desatualizado (outdated)
     * Retorna true se o last_analysis mais recente dos posts for mais novo que o last_sync do item
     */
    private calculateOutdated(item: Item): boolean {
        if (!item.last_sync) return true;
        if (!item.posts || item.posts.length === 0) return false;

        // Encontra o last_analysis mais recente entre todos os posts
        let mostRecentAnalysis: Date | null = null;
        
        for (const post of item.posts) {
            if (post.last_analysis) {
                if (!mostRecentAnalysis || post.last_analysis > mostRecentAnalysis) {
                    mostRecentAnalysis = post.last_analysis;
                }
            }
        }

        // Se não há nenhuma análise, considera como atualizado
        if (!mostRecentAnalysis) return false;

        // Retorna true se a análise mais recente for mais nova que o last_sync
        return mostRecentAnalysis > item.last_sync;
    }

    /**
     * Converte um Item para ItemResponseDto adicionando o campo outdated
     */
    private toItemResponseDto(item: Item): ItemResponseDto {
        return {
            ...item,
            outdated: this.calculateOutdated(item)
        };
    }
}
