import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandQuery } from './query/item.query';

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>
    ) {}

    async create(brandDto: CreateBrandDto): Promise<Brand> {
        try {
            const brand = new Brand();
            brand.name = brandDto.name;
            brand.about = brandDto.about;
            brand.user = brandDto.user;
            brand.pages = brandDto.pages ?? [];
            brand.items = brandDto.items ?? [];
            
            return await this.brandRepository.save(brand);
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<Brand> {
        try {
            return await this.brandRepository.findOne({
                where: {
                    id: id
                },
            });
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAllByUser(
        query?: BrandQuery
    ): Promise<Brand[]> {
        try {
            const brand = await this.brandRepository.find({
                where: {
                    user: {
                        id: +query.user_id,
                    }
                },
                order: {
                    [query.sort_by ?? 'updated_date'] : query.sort_order ?? 'ASC',
                },
                relations: {
                    pages: true,
                }
            });
            return brand;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id:number, brandDto: UpdateBrandDto): Promise<UpdateBrandDto> {
        try {
            const brand = await this.findOne(id);
    
            if (!brand) {
            throw new NotFoundException('brand not found.');
            }
    
            const { id: dtoId, ...dtoWithoutId } = brandDto;
            Object.assign(brand, dtoWithoutId);
    
            const updatedBrand = await this.brandRepository.save(brand);
            return updatedBrand;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number) {
        try {
          await this.brandRepository.delete(id);
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
