import { Question } from '../questions/question.interface';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;
  
  @Column({ unique: true })
  email: string;

  @Column()
  timestamp: string

  @OneToMany(() => Question, question => question, {
    cascade: true,
    eager: true,
  })
  question: Question[];
}