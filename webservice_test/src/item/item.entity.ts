import { Brand } from 'src/brand/brand.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { ItemAnalysisResult } from 'src/item-analysis-result/item-analysis-result.entity';
import { Post } from 'src/post/post.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'item' })
export class Item extends AbstractEntity {
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'type' })
    @JoinColumn({ name: 'type' }) //TODO: verificar se isso é necessário
    type: 'PRODUCT' | 'SERVICE';

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'last_analysis', nullable: true })
    @JoinColumn({ name: 'last_analysis' })
    last_analysis?: Date;

    @ManyToOne(() => Brand, (brand) => brand.items)
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