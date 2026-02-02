import { Controller, Get, Post, Body, Delete, Patch, Param, Query, } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersDefinition } from './DTO/user';
import { LoginUserDto } from './DTO/login';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('login')
  loginUser(@Body() loginDto: LoginUserDto) {
    return this.userService.login(loginDto);
  }

  @Post('register')
  registerUser(@Body() userData: UsersDefinition) {
    return this.userService.register(userData);
  }

  @Patch('delete/:id')
  deleteQuestion(
    @Param('id') id: any,
  ) {
    return this.userService.banUser(+id);
  }

  @Get()
  getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.userService.getAll({page, limit});
}

}
