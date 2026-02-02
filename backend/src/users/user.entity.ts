import { Answer } from "src/answers/answer.entity";
import { Question } from "src/questions/question.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Question, (q) => q.user)
  questions: Question[];

  @OneToMany(() => Answer, (a) => a.user)
  answers: Answer[];

  @Column({default:false})
  isBanned: boolean;
}
