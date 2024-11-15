import {CreateDateColumn, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn({ name: 'created_date' })
    @JoinColumn({ name: 'created_date' })
    created_date: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    @JoinColumn({ name: 'updated_date' })
    updated_date: Date;
}