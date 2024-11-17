import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Item } from 'src/item/item.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'item_analysis_result' })
export class ItemAnalysisResult extends AbstractEntity {
    @Column({ name: 'analysis_summary' })
    analysis_summary: string;

    @Column({ name: 'positive_points' })
    positive_points: string;

    @Column({ name: 'negative_points' })
    negative_points: string;

    @Column({ name: 'analysis_date', nullable: true })
    @JoinColumn({ name: 'analysis_date' })
    analysis_date?: Date;

    @Column({ name: 'version' })
    version: number;

    @ManyToOne(
        () => Item,
        (item) => item.item_analysis_result,
        { nullable: false }
    )
    @JoinColumn({ name: 'item_id' })
    item: Item;
}