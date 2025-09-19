import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandQuery } from './query/item.query';
import { User } from 'src/user/user.entity';
import { Page } from 'src/page/page.entity';
import { ItemService } from 'src/item/item.service';
import { BrandInfoDto } from './dto/brand-items-statistics-response.dto';
import { ItemQuery } from 'src/item/query/item.query';

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Page)
        private readonly pageRepository: Repository<Page>,
        private readonly itemService: ItemService
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
                relations: {
                    pages: true,
                }
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

    async getItemsAndStatistics(brandId: number): Promise<BrandInfoDto> {
        try {
            // Buscar informações da marca e suas páginas
            const brand = await this.brandRepository.findOne({
                where: { id: brandId },
                relations: { pages: true }
            });

            if (!brand) {
                throw new NotFoundException('Brand not found.');
            }

            // Buscar itens com posts e average_scores usando o ItemService
            const itemQuery: ItemQuery = {
                brand_id: brandId.toString(),
                type: undefined,
                sort_by: 'updated_date',
                sort_order: 'ASC'
            };

            const items = await this.itemService.findAllWithPosts(itemQuery);

            // Calcular brand_average_score (média dos item_average_scores)
            const itemAverageScores = items
                .map(item => item.item_average_score)
                .filter(score => score !== null && score !== undefined) as number[];

            const brandAverageScore = itemAverageScores.length > 0
                ? itemAverageScores.reduce((sum, score) => sum + score, 0) / itemAverageScores.length
                : null;

            // Converter pages para PageInfoDto[]
            const pagesInfo = brand.pages?.map(page => ({
                id: page.id,
                title: page.title,
                page_description: page.page_description,
                created_date: page.created_date,
                updated_date: page.updated_date
            })) || [];

            // Converter brand para BrandInfoDto com todas as propriedades
            const brandInfo = {
                id: brand.id,
                name: brand.name,
                about: brand.about,
                created_date: brand.created_date,
                updated_date: brand.updated_date,
                pages: pagesInfo,
                items: items,
                brand_average_score: brandAverageScore
            };

            return brandInfo;
        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
