import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './create-answer.dto';

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) { }

  @Post()
  createAnswer(@Body() dto: CreateAnswerDto) {
    return this.answerService.create(dto);
  }

  @Post(':id/reply')
  replyToAnswer(
    @Param('id') answerId: string,
    @Body() dto,
  ) {
    console.log(answerId, dto, 'i am good')
    return this.answerService.reply(+answerId, dto);
  }

  @Get()
  getAllAnswers() {
    return this.answerService.getAll();
  }

  @Get('question/:id')
  getAnswersByQuestion(@Param('id') questionId: string) {
    return this.answerService.getAnswerByQuestionId(+questionId);
  }

  @Patch(':id/upvote')
  upvoteAnswer(@Param('id') answerId: string) {
    return this.answerService.upvote(+answerId);
  }

  @Patch(':id/downvote')
  downvoteAnswer(@Param('id') answerId: string) {
    return this.answerService.downvote(+answerId);
  }

  @Get(':id/replies')
  getReplies(@Param('id') answerId: string) {
    return this.answerService.getRepliesByAnswerId(+answerId);
  }

}
