import { Brand } from 'src/brand/brand.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'user' })
export class User extends AbstractEntity {
    @Column({ name: 'email', unique: true })
    email: string;

    @Column({ name: 'access_key' })
    access_key: string;

    @OneToMany(() => Brand, (brand) => brand.user)
    brands: Brand[];
}