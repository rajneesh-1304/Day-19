import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Question } from './question.entity';
import { User } from '../users/user.entity';
import { Tag } from '../tags/tag.entity';
import { CreateQuestionDto } from './create-question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateQuestionDto) {
    const questionRepo = this.dataSource.getRepository(Question);
    const userRepo = this.dataSource.getRepository(User);
    const tagRepo = this.dataSource.getRepository(Tag);

    const user = await userRepo.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tags: Tag[] = [];

    for (const tagName of dto.tags) {
      const normalized = tagName.toLowerCase();

      let tag = await tagRepo.findOne({
        where: { name: normalized },
      });

      if (!tag) {
        tag = tagRepo.create({ name: normalized });
        await tagRepo.save(tag);
      }

      tags.push(tag);
    }

    const question = questionRepo.create({
      title: dto.title,
      description: dto.description,
      type: dto.type,
      user,
      tags,
    });

    await questionRepo.save(question);

    return {
      message: 'Question created successfully',
      questionId: question.id,
    };
  }

  async getAll() {
    const questionRepo = this.dataSource.getRepository(Question);

    return questionRepo.find({
      relations: ['user', 'tags'],
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        createdAt: true,
        user: {
          id: true,
          displayName: true,
        },
        tags: {
          id: true,
          name: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
