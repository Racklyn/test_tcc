import { Comment } from 'src/comment/comment.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Item } from 'src/item/item.entity';
import { Page } from 'src/page/page.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'post' })
export class Post extends AbstractEntity {
    @Column({ name: 'content', nullable: true })
    content?: string;

    @Column({ name: 'summary', nullable: true })
    summary?: string;

    @Column({ name: 'post_date' })
    @JoinColumn({ name: 'post_date' })
    post_date: Date;

    @Column({ name: 'reactions', nullable: true })
    reactions?: number;

    @Column({ name: 'url' })
    url: string; //TODO: verificar se é necessário isso

    @Column({ name: 'last_analysis', nullable: true })
    @JoinColumn({ name: 'last_analysis' })
    last_analysis?: Date;

    @ManyToOne(() => Page, (page) => page.posts)
    @JoinColumn({ name: 'page_id' })
    page: Page;

    @ManyToOne(() => Item, (item) => item.posts)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[]
}