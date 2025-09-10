import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Item } from 'src/item/item.entity';
import { DEFAULT_ANALYZER_INFOS } from 'src/common/defaults';

@Entity({ name: 'item_analysis_result' })
@Unique(['version', 'item'])
export class ItemAnalysisResult extends AbstractEntity {
    @Column({ name: 'analysis_summary' })
    analysis_summary: string;

    @Column({ name: 'positive_points' })
    positive_points: string;

    @Column({ name: 'negative_points' })
    negative_points: string;

    @Column({ name: 'analysis_date' })
    @JoinColumn({ name: 'analysis_date' })
    analysis_date: Date;

    @Column({ name: 'version', type: 'int' })
    version: number;

    @Column({ name: 'analyzer_infos', type: 'varchar', length: 500, nullable: true, default: DEFAULT_ANALYZER_INFOS })
    analyzer_infos?: string;

    @ManyToOne(
        () => Item,
        (item) => item.item_analysis_result,
        { nullable: false }
    )
    @JoinColumn({ name: 'item_id' })
    item: Item;
}