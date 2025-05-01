import { Injectable, NotFoundException } from '@nestjs/common';
import { dummyUsers } from '../../common/utils/data';
import {
  PaginationOptions,
  UserRole,
  UserType,
} from '../../common/utils/types';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  private users = [...dummyUsers];

  findAll(options: PaginationOptions) {

  }
  getUserById(id: number) {

  }
  deleteUserByID(id: number) {

  }
  getUserCommentsById(id: number) {

  }
  createUser(user: CreateUserDto) {

  }
  updateUser(id: number, updateUserDto: UpdateUserDto): {

  }
}
