import { CommentAnalysis } from 'src/comment-analysis/comment-analysis.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Post } from 'src/post/post.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'comment' })
export class Comment extends AbstractEntity {
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
}