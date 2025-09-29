import { Comment } from 'src/comment/comment.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Min, Max } from 'class-validator';
import { DEFAULT_ANALYZER_INFOS } from 'src/common/defaults';
import { decimalTransformer } from 'src/utils/transformers';


@Entity({ name: 'comment_analysis' })
@Unique(['version', 'comment'])
export class CommentAnalysis extends AbstractEntity {
    @Column({ 
        name: 'score', 
        type: 'decimal', 
        precision: 3, 
        scale: 2,
        transformer: decimalTransformer
    })
    @Min(0)
    @Max(1)
    score: number;

    @Column({ name: 'version', type: 'int' })
    version: number;

    @Column({ name: 'related_to' })
    @JoinColumn({ name: 'related_to' })
    related_to: 'postItem' | 'postBrand' | 'beyondPost';

    @Column({ name: 'analysis_date' })
    @JoinColumn({ name: 'analysis_date' })
    analysis_date: Date;

    @Column({ name: 'analyzer_infos', type: 'varchar', length: 500, nullable: true, default: DEFAULT_ANALYZER_INFOS })
    analyzer_infos?: string;

    @ManyToOne(
        () => Comment,
        (comment) => comment.comment_analysis,
        { nullable: false }
    )
    @JoinColumn({ name: 'comment_key' })
    comment: Comment;
}