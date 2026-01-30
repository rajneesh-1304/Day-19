import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Answer } from './answer.entity';
import { Question } from 'src/questions/question.entity';
import { error } from 'console';

@Injectable()
export class AnswerService {
  constructor(private readonly dataSource: DataSource) { }

  async create(dto) {
    const questionRepo = this.dataSource.getRepository(Question);
    const answerRepo = this.dataSource.getRepository(Answer);

    const question = await questionRepo.findOne({
      where: { id: dto.questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const answerExist = await answerRepo.findOne({
      where: { answer: dto.answer }
    })

    if (answerExist) {
      throw new ConflictException('Answer already exists');
    }

    const answer = answerRepo.create({
      answer: dto.answer,
      question,
      userId: dto.userId,
    });

    await answerRepo.save(answer);

    return {
      message: 'Answer created successfully',
      answerId: answer.id,
    };
  }

  async getAll() {
    const answerRepo = this.dataSource.getRepository(Answer);
    return answerRepo.find();
  }

  async getAnswerByQuestionId(id: number) {
    const questionRepo = this.dataSource.getRepository(Question);
    const answerRepo = this.dataSource.getRepository(Answer);
    const isQuestion = await questionRepo.findOne({ where: { id }, relations: ['answers'] });
    console.log(isQuestion)
    if (!isQuestion) {
      throw new NotFoundException("Question not found");
    }

    console.log("--------", await answerRepo.find())
    const answer = await answerRepo.find({
      where: { question: {id} },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    console.log(answer);
    return answer;
  }
}
