import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { SortOrder } from '../../common/utils/types';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users') // localhost:3000/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    this.usersService = usersService;
  }

  @Get()
  getAllUsers(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: string,
    @Query('order') order: SortOrder,
  ) {
    return this.usersService.getAllUsers({ page, limit, sort, order });
  }
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }
  @Get(':id/comments/:commentId')
  getUserCommentsById(
    @Param('id', ParseIntPipe) id: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    console.log(id);
    console.log(commentId);
    const result = this.usersService.getUserCommentsById(id);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.deleteUserByID(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
  @Post('signup')
  createUser(@Body() newUser: CreateUserDto) {
    const user = this.usersService.createUser(newUser);
    return user;
  }
}
