import {
  ConflictException,
  ForbiddenException,
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

    if(user.isBanned){
      throw new ForbiddenException('User is banned, please contact admin');
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

  async getAll({
    page, limit
  }) {
    const userRepo = this.dataSource.getRepository(User);

    const [user, total] = await userRepo.createQueryBuilder('user').skip((page-1) * limit).take(limit).getManyAndCount();
    console.log(user);
    return {
      user: user,
      total,
      page, limit, hasMore: page* limit <total
    };
  }

  async banUser(id: number){
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isBanned=!user.isBanned;
    await userRepo.save(user);
  }
}
