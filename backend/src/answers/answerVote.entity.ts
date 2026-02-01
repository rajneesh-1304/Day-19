import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Answer } from "./answer.entity";
import { VoteType } from "src/questions/questionVote.entity";

@Entity('answer_votes')
@Unique(['user', 'answer'])
export class AnswerVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Answer, (a) => a.votes, { onDelete: 'CASCADE' })
  answer: Answer;

  @Column({
    type: 'enum',
    enum: VoteType,
  })
  vote: VoteType;
}
