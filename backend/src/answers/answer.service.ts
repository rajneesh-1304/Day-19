import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Answer } from './answer.entity';
import { Question } from 'src/questions/question.entity';
import { CreateAnswerDto } from './create-answer.dto';

@Injectable()
export class AnswerService {
  constructor(private readonly dataSource: DataSource) { }

  async create(dto: CreateAnswerDto) {
    const questionRepo = this.dataSource.getRepository(Question);
    const answerRepo = this.dataSource.getRepository(Answer);

    const question = await questionRepo.findOne({
      where: { id: dto.questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    let parentAnswer: Answer = null;

    // 🔹 If reply
    if (dto.parentAnswerId) {
      parentAnswer = await answerRepo.findOne({
        where: { id: dto.parentAnswerId },
      });

      if (!parentAnswer) {
        throw new NotFoundException('Parent answer not found');
      }
    }

    const answer = answerRepo.create({
      content: dto.content,
      question,
      parentAnswer,
    });

    await answerRepo.save(answer);

    return {
      message: dto.parentAnswerId
        ? 'Reply added successfully'
        : 'Answer added successfully',
      answerId: answer.id,
    };
  }

  async getAll() {
    const answerRepo = this.dataSource.getRepository(Answer);

    return answerRepo.find({
      relations: ['question', 'replies'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getAnswerByQuestionId(questionId: number) {
    const questionRepo = this.dataSource.getRepository(Question);
    const answerRepo = this.dataSource.getRepository(Answer);

    const question = await questionRepo.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return answerRepo.find({
      where: {
        question: { id: questionId },
        parentAnswer: null,
      },
      relations: ['replies'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async upvote(answerId: number) {
    const answerRepo = this.dataSource.getRepository(Answer);
    const answer = await answerRepo.findOne({ where: { id: answerId } });

    if (!answer) throw new NotFoundException('Answer not found');

    answer.upVotes += 1;
    answer.score = answer.upVotes - answer.downVotes;
    await answerRepo.save(answer);

    return answer;
  }

  async downvote(answerId: number) {
    const answerRepo = this.dataSource.getRepository(Answer);
    const answer = await answerRepo.findOne({ where: { id: answerId } });

    if (!answer) throw new NotFoundException('Answer not found');

    answer.downVotes += 1;
    answer.score = answer.upVotes - answer.downVotes;
    await answerRepo.save(answer);

    return answer;
  }

  async reply(parentAnswerId: number, dto: { answer: string; userId: number }) {
    const answerRepo = this.dataSource.getRepository(Answer);

    const parentAnswer = await answerRepo.findOne({
      where: { id: parentAnswerId },
      relations: ['question']
    });
    if (!parentAnswer) {
      throw new NotFoundException('Parent answer not found');
    }

    const reply = answerRepo.create({
      content: dto.answer,
      question: parentAnswer.question,
      parentAnswer,
      user: { id: dto.userId },
    });

    await answerRepo.save(reply);

    return {
      message: 'Reply added successfully',
      replyId: reply.id,
    };
  }

 async getRepliesByAnswerId(answerId: number): Promise<Answer[]> {
  const answerRepo = this.dataSource.getRepository(Answer);

  const replies = await answerRepo.find({
    where: { parentAnswer: { id: answerId } },
    relations: ['user', 'replies'], 
    order: { createdAt: 'ASC' },
  });

  for (const reply of replies) {
    reply.replies = await this.getRepliesByAnswerId(reply.id);
  }

  return replies;
}



}
