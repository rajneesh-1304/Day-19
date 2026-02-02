import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './create-question.dto';
import {  VoteType } from './questionVote.entity';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.questionService.create(dto);
  }

  @Get()
  getAllQuestions(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('search') search?: string,
  @Query('sort') sort: 'score' | 'newest' = 'newest', 
  @Query('tags') tags?: string, 
) {
  const tagList = tags ? tags.split(',').map(t => t.trim()) : undefined;

  return this.questionService.getAll({
    page: Number(page),
    limit: Number(limit),
    search,
    sort,
    tags: tagList,
  });
}


  @Get(':id')
  getQuestionById(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ) {
    return this.questionService.getQuestionById(
      +id,
      userId ? +userId : undefined,
    );
  }

  @Patch(':id/publish')
  publishQuestion(
    @Param('id') id: string,
    @Body('userId') userId: number,
  ) {
    return this.questionService.publish(+id, userId);
  }

  @Patch(':id/upvote')
  upvoteQuestion(
    @Param('id') questionId: string,
    @Body('userId') userId: number,
  ) {
    return this.questionService.vote(+questionId, userId, VoteType.UP);
  }

  @Patch(':id/downvote')
  downvoteQuestion(
    @Param('id') questionId: string,
    @Body('userId') userId: number,
  ) {
    return this.questionService.vote(+questionId, userId, VoteType.DOWN);
  }

  @Patch(':id')
  updateQuestion(
    @Param('id') id: any,
    @Body() dto: any,
  ) {
    return this.questionService.update(+id, dto);
  }

  @Patch('delete/:id')
  deleteQuestion(
    @Param('id') id: any,
  ) {
    return this.questionService.delete(+id);
  }

}
