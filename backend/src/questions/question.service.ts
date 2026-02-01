import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Question, QuestionType } from './question.entity';
import { User } from '../users/user.entity';
import { Tag } from '../tags/tag.entity';
import { CreateQuestionDto } from './create-question.dto';
import { QuestionVote, VoteType } from './questionVote.entity';

@Injectable()
export class QuestionService {
  constructor(private readonly dataSource: DataSource) {}

async create(dto: CreateQuestionDto) {
  const questionRepo = this.dataSource.getRepository(Question);
  const userRepo = this.dataSource.getRepository(User);
  const tagRepo = this.dataSource.getRepository(Tag);

  // 1️⃣ Get user
  const user = await userRepo.findOne({
    where: { id: dto.userId },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const tags: Tag[] = [];

for (const tagName of dto.tags || []) {
  const normalized = tagName.trim().toLowerCase();

  let tag = await tagRepo.findOne({ where: { name: normalized } });

  if (!tag) {
    tag = tagRepo.create({ name: normalized });
    await tagRepo.save(tag); 
  }

  tags.push(tag);
}

const question = questionRepo.create({
  title: dto.title,
  description: dto.description,
  type: dto.type ?? QuestionType.DRAFT,
  user,
  tags,
});

await questionRepo.save(question);

  return {
    message: 'Question created successfully',
    questionId: question.id,
    type: question.type,
    tags: tags.map(t => t.name), 
  };
}

async getAll({
  page,
  limit,
  search,
  sort = 'newest',
  tags,
}: {
  page: number;
  limit: number;
  search?: string;
  sort?: 'score' | 'newest';
  tags?: string[];
}) {
  const questionRepo = this.dataSource.getRepository(Question);

  const query = questionRepo
    .createQueryBuilder('question')
    .leftJoinAndSelect('question.user', 'user')
    .leftJoinAndSelect('question.tags', 'tags')
    .where('question.type = :type', { type: QuestionType.PUBLIC });

  // Search filter
  if (search) {
    query.andWhere(
      `(LOWER(question.title) LIKE :search
        OR LOWER(question.description) LIKE :search
        OR LOWER(tags.name) LIKE :search)`,
      { search: `%${search.toLowerCase()}%` },
    );
  }

  if (tags && tags.length > 0) {
    query.andWhere('tags.name IN (:...tags)', { tags });
  }

  if (sort === 'score') {
    query.orderBy('question.score', 'DESC');
  } else if (sort === 'newest') {
    query.orderBy('question.createdAt', 'DESC');
  }

  const [questions, total] = await query
    .select([
      'question.id',
      'question.title',
      'question.description',
      'question.type',
      'question.createdAt',
      'question.score',
      'question.upVotes',
      'question.downVotes',
      'user.id',
      'user.displayName',
      'tags.id',
      'tags.name',
    ])
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    data: questions,
    page,
    limit,
    total,
    hasMore: page * limit < total,
  };
}

  async getQuestionById(id: number, userId?: number) {
    const questionRepo = this.dataSource.getRepository(Question);

    const question = await questionRepo.findOne({
      where: { id },
      relations: ['user', 'tags'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (
      question.type === QuestionType.DRAFT &&
      question.user.id !== userId
    ) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async publish(questionId: number, userId: number) {
    const questionRepo = this.dataSource.getRepository(Question);

    const question = await questionRepo.findOne({
      where: { id: questionId },
      relations: ['user'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.user.id !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    question.type = QuestionType.PUBLIC;
    await questionRepo.save(question);

    return { message: 'Question published successfully' };
  }

  async vote(
    questionId: number,
    userId: number,
    voteType: VoteType,
  ) {
    const questionRepo = this.dataSource.getRepository(Question);
    const voteRepo = this.dataSource.getRepository(QuestionVote);
    const userRepo = this.dataSource.getRepository(User);

    const question = await questionRepo.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const user = await userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let vote = await voteRepo.findOne({
      where: {
        user: { id: userId },
        question: { id: questionId },
      },
      relations: ['user', 'question'],
    });

    if (vote && vote.vote === voteType) {
      await voteRepo.remove(vote);

      voteType === VoteType.UP
        ? question.upVotes--
        : question.downVotes--;
    } else {
      if (!vote) {
        vote = voteRepo.create({
          user,
          question,
          vote: voteType,
        });
      } else {
        vote.vote === VoteType.UP
          ? question.upVotes--
          : question.downVotes--;

        vote.vote = voteType;
      }

      voteType === VoteType.UP
        ? question.upVotes++
        : question.downVotes++;

      await voteRepo.save(vote);
    }

    question.score = question.upVotes - question.downVotes;
    await questionRepo.save(question);

    return {
      upVotes: question.upVotes,
      downVotes: question.downVotes,
      score: question.score,
    };
  }


async update(
  questionId: number,
  userId: number,
  dto: Partial<CreateQuestionDto>, 
) {
  const questionRepo = this.dataSource.getRepository(Question);
  const tagRepo = this.dataSource.getRepository(Tag);

  // 1️⃣ Find the question
  const question = await questionRepo.findOne({
    where: { id: questionId },
    relations: ['user', 'tags'],
  });

  if (!question) {
    throw new NotFoundException('Question not found');
  }

  if (question.user.id !== userId) {
    throw new ForbiddenException('You are not allowed to update this question');
  }

  if (dto.title) question.title = dto.title;
  if (dto.description) question.description = dto.description;
  if (dto.type) question.type = dto.type;

  if (dto.tags) {
    const tags: Tag[] = [];

    for (const tagName of dto.tags) {
      const normalized = tagName.toLowerCase();

      let tag = await tagRepo.findOne({ where: { name: normalized } });

      if (!tag) {
        tag = tagRepo.create({ name: normalized });
        await tagRepo.save(tag);
      }

      tags.push(tag);
    }

    question.tags = tags;
  }

  await questionRepo.save(question);

  return {
    message: 'Question updated successfully',
    questionId: question.id,
    title: question.title,
    description: question.description,
    type: question.type,
    tags: question.tags.map(t => t.name),
  };
}

}


