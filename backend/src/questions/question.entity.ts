import { Answer } from "src/answers/answer.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { QuestionVote } from "./questionVote.entity";
import { Tag } from "src/tags/tag.entity";

export enum QuestionType {
  DRAFT = 'DRAFT',
  PUBLIC = 'PUBLIC',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.DRAFT,
  })
  type: QuestionType;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.questions, {
    cascade: true,
  })
  @JoinTable({
    name: 'question_tags',
  })
  tags: Tag[];

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @Column({ default: 0 })
  upVotes: number;

  @Column({ default: 0 })
  downVotes: number;

  @Column({ default: 0 })
  score: number;

  @OneToMany(() => QuestionVote, (vote) => vote.question)
  votes: QuestionVote[];
}
