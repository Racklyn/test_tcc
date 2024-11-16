import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Controller('page')
export class PageController {
    constructor(
        private readonly pageService: PageService
    ) { }

    @Post()
    async create(@Body() page: CreatePageDto) {
        const created_page = await this.pageService.create(page);
        return created_page;
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.pageService.findOne(id);
    }

    @Get()
    async findAll(){
        const pages = await this.pageService.findAll();
        return pages;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePageDto: UpdatePageDto,
    ) {
        return await this.pageService.update(+id, updatePageDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.pageService.remove(+id);
    }
}
