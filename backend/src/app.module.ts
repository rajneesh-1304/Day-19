import { Module, Controller, Get } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UserModule } from './users/user.module';
import { Question } from './questions/question.entity';
import { Tag } from './tags/tag.entity';
import { QuestionModule } from './questions/question.module';
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
      password: '1234',
      database: 'stack',
      entities: [
        User, Question, Tag
      ],
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
    }),
    UserModule,
    QuestionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}