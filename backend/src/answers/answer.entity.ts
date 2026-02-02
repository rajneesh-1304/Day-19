import { Question } from "src/questions/question.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AnswerVote } from "./answerVote.entity";

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Question, (q) => q.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentAnswerId' })
  parentAnswer: Answer;

  @OneToMany(() => Answer, (answer) => answer.parentAnswer)
  replies: Answer[];

  @Column({ default: 0 })
  upVotes: number;

  @Column({ default: 0 })
  downVotes: number;

  @Column({ default: 0 })
  score: number;

  @Column({ default: false })
    isValid: boolean;

  @OneToMany(() => AnswerVote, (vote) => vote.answer)
  votes: AnswerVote[];
}
