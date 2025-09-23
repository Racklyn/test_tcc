import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandQuery } from './query/item.query';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BrandInfoDto } from './dto/brand-items-statistics-response.dto';

@ApiTags('brand')
@Controller('brand')
export class BrandController {
    constructor(
        private readonly brandService: BrandService
    ) { }

    @Post()
    async create(@Body() brand: CreateBrandDto) {
        const created_brand = await this.brandService.create(brand);
        return created_brand;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.brandService.findOne(+id);
    }

    @Get(':id/itemsAndStatistics')
    @ApiOperation({ 
        summary: 'Buscar itens e estatísticas da marca',
        description: 'Retorna uma marca com todos os seus itens, average_scores e o brand_average_score'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Itens e estatísticas retornados com sucesso',
        type: BrandInfoDto
    })
    async getItemsAndStatistics(@Param('id') id: string) {
        return await this.brandService.getItemsAndStatistics(+id);
    }

    @Get()
    @ApiQuery({ name: 'user_id' })
    @ApiQuery({ name: 'sort_by', required: false })
    @ApiQuery({ name: 'sort_order', required: false })
    async findAllByUser(@Query() query: BrandQuery){
        const brands = await this.brandService.findAllByUser(query);
        return brands;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateBrandDto: UpdateBrandDto,
    ) {
        return await this.brandService.update(+id, updateBrandDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.brandService.remove(+id);
    }
}
