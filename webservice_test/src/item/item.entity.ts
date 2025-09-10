import { Brand } from 'src/brand/brand.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { ItemAnalysisResult } from 'src/item-analysis-result/item-analysis-result.entity';
import { Post } from 'src/post/post.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'item' })
export class Item extends AbstractEntity {
    @Column({ name: 'name' })
    name: string;

    @Column({
        name: 'block_name_from_updates',
        nullable: true,
        default: false
    })
    block_name_from_updates?: boolean;

    @Column({ name: 'type' })
    @JoinColumn({ name: 'type' })
    type: 'product' | 'service';

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'last_sync', nullable: true })
    @JoinColumn({ name: 'last_sync' })
    last_sync?: Date;

    @ManyToOne(
        () => Brand,
        (brand) => brand.items,
        { nullable: false }
    )
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @OneToMany(
        () => ItemAnalysisResult,
        (item_analysis_result) => item_analysis_result.item
    )
    item_analysis_result: ItemAnalysisResult[];

    @OneToMany(() => Post, (post) => post.item)
    posts: Post[];
}