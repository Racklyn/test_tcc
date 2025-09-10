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
        console.log(item);
        const created_item = await this.itemService.create(item);
        return created_item;
    }
    
    @Get('withPosts')
    @ApiQuery({ name: 'brand_id', required: false  })
    @ApiQuery({ name: 'type', required: false  })
    @ApiQuery({ name: 'sort_by', required: false  })
    @ApiQuery({ name: 'sort_order', required: false  })
    async findAllWithPosts(@Query() query: ItemQuery){
        const items = await this.itemService.findAllWithPosts(query);
        return items;
    }
    
    @Get('statistics')
    @ApiQuery({ name: 'brand_id', required: false  })
    @ApiQuery({ name: 'type', required: false  })
    @ApiQuery({ name: 'sort_by', required: false  })
    @ApiQuery({ name: 'sort_order', required: false  })
    async findAllWithStatistics(@Query() query: ItemQuery){
        const items = await this.itemService.findAllWithStatistics(query);
        return items;
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.itemService.findOne(id);
    }

    @Get()
    @ApiQuery({ name: 'brand_id', required: false  })
    @ApiQuery({ name: 'type', required: false  })
    @ApiQuery({ name: 'sort_by', required: false  })
    @ApiQuery({ name: 'sort_order', required: false  })
    async findAll(@Query() query: ItemQuery){
        const items = await this.itemService.findAll(query);
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
