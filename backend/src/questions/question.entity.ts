import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('question')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  
  @Column()
  description: string;

  

  @Column()
  // tag: string[];

  @Column()
  type: string;

  @Column()
  userId: number;
}