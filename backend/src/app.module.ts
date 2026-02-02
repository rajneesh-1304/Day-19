import { Module, Controller, Get } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UserModule } from './users/user.module';
import { Question } from './questions/question.entity';
import { Tag } from './tags/tag.entity';
import { QuestionModule } from './questions/question.module';
import { AnswerModule } from './answers/answer.module';
import { Answer } from './answers/answer.entity';
import { QuestionVote } from './questions/questionVote.entity';
import { AnswerVote } from './answers/answerVote.entity';
import { TagModule } from './tags/tag.module';
@Controller()
class AppController {
  @Get()
  root() {
    return { message: 'NestJS Todo Backend is running!' };
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'stack',
      entities: [
        User, Question, Tag, Answer, QuestionVote, AnswerVote
      ],
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
    }),
    UserModule,
    QuestionModule,
    AnswerModule,
    TagModule,
  ],
  controllers: [AppController],
})
export class AppModule {}