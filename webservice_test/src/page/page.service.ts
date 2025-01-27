import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(Page)
        private readonly pageRepository: Repository<Page>
    ) {}

    async create(pageDto: CreatePageDto): Promise<Page> {
        console.log(pageDto.brand)

        try {
            const page = new Page();
            page.title = pageDto.title;
            page.page_description = pageDto.page_description;
            page.brand = pageDto.brand;

            //TODO: verificar se faz sentido inserir essas listas:
            // page.posts = pageDto.posts ?? [];
            
            return await this.pageRepository.save(page);
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<Page> {
        try {
            return await this.pageRepository.findOne({
                where: {
                    id: id
                },
            });
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(brand_id: number): Promise<Page[]> {
        try {
            const page = await this.pageRepository.find({
                where: {
                    brand: {
                        id: brand_id
                    }
                }
            });
            return page;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id:number, pageDto: UpdatePageDto): Promise<UpdatePageDto> {
        try {
            const page = await this.findOne(id);
    
            if (!page) {
            throw new NotFoundException('Page not found.');
            }
    
            const { id: dtoId, ...dtoWithoutId } = pageDto;
            Object.assign(page, dtoWithoutId);
    
            const updatedPage = await this.pageRepository.save(page);
            return updatedPage;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number) {
        try {
          await this.pageRepository.delete(id);
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
