import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandQuery } from './query/item.query';
import { User } from 'src/user/user.entity';
import { Page } from 'src/page/page.entity';

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Page)
        private readonly pageRepository: Repository<Page>
    ) {}

    async create(brandDto: CreateBrandDto): Promise<Brand> {
        try {

            const user = await this.userRepository.findOne({
                where: {
                    id: brandDto.user_id
                }
            });

            if (!user) {
                throw new NotFoundException('User not found.');
            }

            const brand = new Brand();
            brand.name = brandDto.name;
            brand.about = brandDto.about;
            brand.user = user;
            
            // Salva a marca primeiro para obter o ID
            const savedBrand = await this.brandRepository.save(brand);
            
            // Cria as páginas se fornecidas
            if (brandDto.pages && brandDto.pages.length > 0) {
                const pages = brandDto.pages.map(pageData => {
                    const page = new Page();
                    if (pageData.id) {
                        page.id = pageData.id;
                    }
                    page.title = pageData.title;
                    page.page_description = pageData.page_description;
                    page.brand = savedBrand;
                    return page;
                });
                
                await this.pageRepository.save(pages);
            }
            
            return savedBrand;
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
    
            const { id: dtoId, pages, ...dtoWithoutId } = brandDto;
            Object.assign(brand, dtoWithoutId);
    
            const updatedBrand = await this.brandRepository.save(brand);
            
            // Atualiza as páginas se fornecidas
            if (pages !== undefined) {
                // Busca páginas existentes da marca
                const existingPages = await this.pageRepository.find({
                    where: { brand: { id: id } }
                });
                
                if (pages && pages.length > 0) {
                    // IDs das páginas fornecidas
                    const providedPageIds = pages
                        .filter(page => page.id)
                        .map(page => page.id);
                    
                    // Remove páginas que não estão na lista fornecida
                    const pagesToDelete = existingPages.filter(
                        existingPage => !providedPageIds.includes(existingPage.id)
                    );
                    
                    if (pagesToDelete.length > 0) {
                        await this.pageRepository.remove(pagesToDelete);
                    }
                    
                    // Processa cada página fornecida
                    for (const pageData of pages) {
                        if (pageData.id) {
                            // Atualiza página existente
                            const existingPage = existingPages.find(p => p.id === pageData.id);
                            if (existingPage) {
                                existingPage.title = pageData.title;
                                existingPage.page_description = pageData.page_description;
                                await this.pageRepository.save(existingPage);
                            }
                        } else {
                            // Cria nova página
                            const newPage = new Page();
                            newPage.title = pageData.title;
                            newPage.page_description = pageData.page_description;
                            newPage.brand = updatedBrand;
                            await this.pageRepository.save(newPage);
                        }
                    }
                } else {
                    // Se lista vazia, remove todas as páginas
                    await this.pageRepository.delete({ brand: { id: id } });
                }
            }
            
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
