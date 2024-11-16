import { Item } from 'src/item/item.entity';

export class CreateItemAnalysisResultDto {
    id?: number;
    analysis_summary: string;
    positive_points: string;
    negative_points: string;
    analysis_date?: Date;
    version: number;
    item: Item;
}
