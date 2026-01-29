import { Controller, Get, Post, Body, Delete, } from '@nestjs/common';
import { UserService } from './question.service';
import { UsersDefinition } from './DTO/user';
import { LoginUserDto } from './DTO/login';
import { Param } from '@nestjs/common';
import { Patch } from '@nestjs/common';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('login')
  loginUser(@Body() loginDto: LoginUserDto) {
    return this.userService.login(loginDto);
  }

  @Post('register')
  registerUser(@Body() userData: UsersDefinition) {
    console.log('fdasd', userData)
    return this.userService.register(userData);
  }

  @Get()
  getAll() {
    return this.userService.getAll();
  }
}
