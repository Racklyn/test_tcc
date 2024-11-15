import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'brand' })
export class Brand extends AbstractEntity {
    @Column({ name: 'name', nullable: false, unique: true })
    name: string;

    @Column({ name: 'about', nullable: false })
    about: string;

    @ManyToOne(() => User, (user) => user.brand)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // @OneToMany(() => Item, (item) => item.brand)
    // items: Item[]
}