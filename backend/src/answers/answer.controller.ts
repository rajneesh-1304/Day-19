import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { AnswerService } from './answer.service';

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  createAnswer(@Body() dto) {
    return this.answerService.create(dto);
  }

  @Get(':id')
  getAnswerById(@Param('id') id:string) {
    return  this.answerService.getAnswerByQuestionId(+id);
  }

  @Get()
  getAllAnswers() {
    return this.answerService.getAll();
  }
}
