import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async register(data: { displayName: string; email: string }) {
    const userRepo = this.dataSource.getRepository(User);

    const existingUser = await userRepo.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const user = userRepo.create({
      displayName: data.displayName,
      email: data.email,
      role: UserRole.USER,
    });

    await userRepo.save(user);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(data: { email: string }) {
    const userRepo = this.dataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User logged in successfully',
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getAll() {
    const userRepo = this.dataSource.getRepository(User);

    return userRepo.find({
      select: {
        id: true,
        displayName: true,
        email: true,
        role: true,
      },
    });
  }
}
