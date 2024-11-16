import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('item')
export class ItemController {
    constructor(
        private readonly itemService: ItemService
    ) { }

    @Post()
    async create(@Body() item: CreateItemDto) {
        const created_item = await this.itemService.create(item);
        return created_item;
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.itemService.findOne(id);
    }

    @Get()
    async findAll(){
        const items = await this.itemService.findAll();
        return items;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateItemDto: UpdateItemDto,
    ) {
        return await this.itemService.update(+id, updateItemDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.itemService.remove(+id);
    }
}
