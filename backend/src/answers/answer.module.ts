import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { AnswerVote } from './answerVote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, AnswerVote])],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
