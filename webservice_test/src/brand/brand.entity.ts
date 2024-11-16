import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Item } from 'src/item/item.entity';
import { Page } from 'src/page/page.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'brand' })
export class Brand extends AbstractEntity {
    @Column({ name: 'name', unique: true })
    name: string;

    @Column({ name: 'about' })
    about: string;

    @ManyToOne(() => User, (user) => user.brands)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Item, (item) => item.brand)
    items: Item[];

    @OneToMany(() => Page, (page) => page.brand)
    pages: Page[];
}