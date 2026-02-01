import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Question } from "./question.entity";

export enum VoteType {
  UP = 'UP',
  DOWN = 'DOWN',
}

@Entity('question_votes')
@Unique(['user', 'question'])
export class QuestionVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Question, (q) => q.votes, { onDelete: 'CASCADE' })
  question: Question;

  @Column({
    type: 'enum',
    enum: VoteType,
  })
  vote: VoteType;
}
