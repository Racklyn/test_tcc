import { Brand } from 'src/brand/brand.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Post } from 'src/post/post.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'page' })
export class Page extends AbstractEntity {
    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'page_description', nullable: true })
    page_description?: string;

    @ManyToOne(() => Brand, (brand) => brand.items)
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @OneToMany(
        () => Post,
        (posts) => posts.page
    )
    posts: Post[];
}