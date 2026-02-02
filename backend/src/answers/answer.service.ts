import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { Answer } from './answer.entity';
import { Question } from 'src/questions/question.entity';
import { CreateAnswerDto } from './create-answer.dto';
import { isNull } from 'util';
import { AnswerVote } from './answerVote.entity';
import { VoteType } from 'src/questions/questionVote.entity';
import { User } from 'src/users/user.entity';

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
        parentAnswer: IsNull(),
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
    if (answer.upVotes === 1) {
      answer.upVotes -= 1;
    } else {
      answer.upVotes += 1;
    }
    answer.score = answer.upVotes - answer.downVotes;
    await answerRepo.save(answer);

    return answer;
  }

  async downvote(answerId: number) {
    const answerRepo = this.dataSource.getRepository(Answer);
    const answer = await answerRepo.findOne({ where: { id: answerId } });

    if (!answer) throw new NotFoundException('Answer not found');

    if (answer.downVotes === 1) {
      answer.downVotes -= 1;
    } else {
      answer.downVotes += 1;
    }
    answer.score = answer.upVotes - answer.downVotes;
    await answerRepo.save(answer);

    return answer;
  }

  async vote(answerId, userId, voteType: VoteType){
    const answerRepo = this.dataSource.getRepository(Answer);
    const answer = await answerRepo.findOne({ where: { id: answerId } });
    const voteRepo = this.dataSource.getRepository(AnswerVote);
    const userRepo = this.dataSource.getRepository(User);

    if (!answer) throw new NotFoundException('Answer not found');

    const user = await userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let vote = await voteRepo.findOne({
      where: {
        user: { id: userId },
        answer: { id: answerId },
      },
      relations: ['user', 'answer'],
    });

    if (vote && vote.vote === voteType) {
          await voteRepo.remove(vote);
    
          voteType === VoteType.UP
            ? answer.upVotes--
            : answer.downVotes--;
        } else {
          if (!vote) {
            vote = voteRepo.create({
              user,
              answer,
              vote: voteType,
            });
          } else {
            vote.vote === VoteType.UP
              ? answer.upVotes--
              : answer.downVotes--;
    
            vote.vote = voteType;
          }
    
          voteType === VoteType.UP
            ? answer.upVotes++
            : answer.downVotes++;
    
          await voteRepo.save(vote);
        }

        answer.score = answer.upVotes - answer.downVotes;
        await answerRepo.save(answer);

        return {
          upVotes: answer.upVotes,
          downVotes : answer.downVotes,
          score: answer.score,
        }

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
