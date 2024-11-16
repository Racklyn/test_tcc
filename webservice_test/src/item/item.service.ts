import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

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
            item.item_analysis_result = itemDto.item_analysis_result;
            item.posts = itemDto.posts;
            
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

    async findAll(): Promise<Item[]> {
        try {
            const item = await this.itemRepository.find();
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
    
            const updatedItem = await this.itemRepository.save(itemDto);
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
