import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

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
    findOne(@Param('id') id: number) {
        return this.brandService.findOne(id);
    }

    @Get()
    async findAll(){
        const brands = await this.brandService.findAll();
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
        return this.brandService.remove(+id);
    }
}
