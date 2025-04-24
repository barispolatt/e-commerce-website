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

  getAllUsers(options: PaginationOptions): UserType[] {
    const { page = 1, limit = 10, sort = 'id', order = 'asc' } = options;

    // Calculate start and end indexes for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Sort and paginate
    return [...this.users]
      .sort((a, b) => {
        if (a[sort] < b[sort]) return order === 'asc' ? -1 : 1;
        if (a[sort] > b[sort]) return order === 'asc' ? 1 : -1;
        return 0;
      })
      .slice(startIndex, endIndex);
  }
  getUserById(id: number) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }
  deleteUserByID(id: number) {
    const user = this.getUserById(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
      return user;
    }
    return null;
  }
  getUserCommentsById(id: number) {
    const user = this.getUserById(id);
    if (!user) {
      return null;
    }
    return {
      user,
      id,
      comments: ['Comments1', 'Comments2', 'Comments3', 'Comments4'],
    };
  }
  createUser(user: CreateUserDto) {
    const newUser = {
      id: Math.round(Math.random() * 1000000),
      ...user,
      birthdate: user.birthdate.toISOString().split('T')[0],
      isActive: true,
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }
  updateUser(id: number, updateUserDto: UpdateUserDto): UserType {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const existingUser = this.users[userIndex];

    const updatedUser: UserType = {
      ...existingUser,
      ...updateUserDto,
      birthdate: updateUserDto.birthdate
        ? updateUserDto.birthdate.toISOString().split('T')[0]
        : existingUser.birthdate,
      updatedAt: new Date().toISOString(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }
}
