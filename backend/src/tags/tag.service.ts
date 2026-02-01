import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(private readonly dataSource: DataSource) {}

  async getAllTags() {
    const tagRepo = this.dataSource.getRepository(Tag);
    return tagRepo.find();
  }
}
