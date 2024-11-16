import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ItemAnalysisResultService } from './item-analysis-result.service';
import { CreateItemAnalysisResultDto } from './dto/create-item-analysis-result.dto';
import { UpdateItemAnalysisResultDto } from './dto/update-item-analysis-result.dto';

@Controller('itemAnalysisResult')
export class ItemAnalysisResultController {
    constructor(
        private readonly itemAnalysisResultService: ItemAnalysisResultService
    ) { }

    @Post()
    async create(@Body() itemAnalysisResult: CreateItemAnalysisResultDto) {
        const created_itemAnalysisResult = await this.itemAnalysisResultService.create(itemAnalysisResult);
        return created_itemAnalysisResult;
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.itemAnalysisResultService.findOne(id);
    }

    @Get()
    async findAll(){
        const itemAnalysisResults = await this.itemAnalysisResultService.findAll();
        return itemAnalysisResults;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateItemAnalysisResultDto: UpdateItemAnalysisResultDto,
    ) {
        return await this.itemAnalysisResultService.update(+id, updateItemAnalysisResultDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.itemAnalysisResultService.remove(+id);
    }
}
