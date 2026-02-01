import { Module } from '@nestjs/common';
import { QuestionController, } from './question.controller';
import { QuestionService,} from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question,} from './question.entity';
import { QuestionVote } from './questionVote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionVote])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
