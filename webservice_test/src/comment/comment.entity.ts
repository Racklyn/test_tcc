import { CommentAnalysis } from 'src/comment-analysis/comment-analysis.entity';
import { Post } from 'src/post/post.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity({ name: 'comment' })
export class Comment {
    @PrimaryColumn()
    public key: string;

    @Column({ name: 'text' })
    text: string;

    @Column({ name: 'date' })
    @JoinColumn({ name: 'date' })
    date: Date;

    @Column({ name: 'reactions', nullable: true })
    reactions?: number;

    @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @OneToMany(
        () => CommentAnalysis,
        (comment_analysis) => comment_analysis.comment
    )
    comment_analysis: CommentAnalysis[];

    @CreateDateColumn({ name: 'created_date' })
    @JoinColumn({ name: 'created_date' })
    created_date: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    @JoinColumn({ name: 'updated_date' })
    updated_date: Date;

    public author: string; //TODO: verificar se é necessário (propriedade temporária, não será persistida)

    // @BeforeInsert()
    // generateKey() {
    //     if (!(this.text && this.date && this.author && this.post)) {
    //         throw new Error('Não é possível gerar a chave sem os dados necessários (text, date, author e post.id).');
    //     }

    //     console.log(`Author: ${this.author}`)
    //     this.key = generateHash(this.text + this.date.toString() + this.author + this.post.id);
    //     console.log(`KEY GERADA: ${this.key}`);
    // }
}