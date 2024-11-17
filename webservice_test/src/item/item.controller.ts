import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemQuery } from './query/item.query';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('item')
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
    async findOne(@Param('id') id: number) {
        return await this.itemService.findOne(id);
    }

    @Get()
    @ApiQuery({ name: 'brand_id' })
    @ApiQuery({ name: 'type' })
    @ApiQuery({ name: 'sort_by' })
    @ApiQuery({ name: 'sort_order' })
    async findAll(@Query() query: ItemQuery){
        const items = await this.itemService.findAll(query);
        return items;
    }

    @Get('statistics')
    @ApiQuery({ name: 'brand_id' })
    @ApiQuery({ name: 'type' })
    @ApiQuery({ name: 'sort_by' })
    @ApiQuery({ name: 'sort_order' })
    async findAllWithStatistics(@Query() query: ItemQuery){
        const items = await this.itemService.findAllWithStatistics(query);
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
        await this.itemService.remove(+id);
    }
}
