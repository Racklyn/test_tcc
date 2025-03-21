import { Comment } from 'src/comment/comment.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'comment_analysis' })
export class CommentAnalysis extends AbstractEntity {
    @Column({ name: 'score' })
    score: number;

    @Column({ name: 'version' })
    version: number;

    @Column({ name: 'related_to' })
    @JoinColumn({ name: 'related_to' }) //TODO: verificar se precisa disso 
    related_to: 'POST_ITEM' | 'POST_BRAND' | 'BEYOND_POST';

    @Column({ name: 'analysis_date' })
    @JoinColumn({ name: 'analysis_date' })
    analysis_date: Date;

    @ManyToOne(
        () => Comment,
        (comment) => comment.comment_analysis,
        { nullable: false }
    )
    @JoinColumn({ name: 'comment_key' })
    comment: Comment;
}