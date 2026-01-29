import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Users } from './user.interface';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) { }

  async register(data) {
    const userRepo = this.dataSource.getRepository(User);

    const existingUser = await userRepo.findOne({
      where: { email: data.email },
    });
    if (existingUser) throw new ConflictException('Email already registered');

    const user = userRepo.create({
      displayName: data.displayName,
      email: data.email,
      timestamp: data.timestamp,
    });

    await userRepo.save(user);
    return { message: 'User registered successfully' };
  }

  async login(data) {
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email: data.email } });
    if (!user) throw new NotFoundException('User not found');

    return {
      message: 'User logged in successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async getAll() {
    const userRepo = this.dataSource.getRepository(User);
    return await userRepo.find();
  }

}
