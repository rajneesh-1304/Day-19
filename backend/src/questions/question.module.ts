import { Module } from '@nestjs/common';
import { UserController } from './question.controller';
import { UserService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
