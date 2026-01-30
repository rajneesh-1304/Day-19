import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './create-question.dto';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.questionService.create(dto);
  }

  @Get(':id')
  getQuestionById(@Param('id') id:string) {
    return  this.questionService.getQuestionById(+id);
  }

  @Get()
  getAllQuestions() {
    return this.questionService.getAll();
  }
}
