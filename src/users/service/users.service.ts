import { Injectable } from '@nestjs/common';
import { dummyUsers } from '../../common/utils/data';
import { UserRole } from '../../common/utils/types';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  private users = [...dummyUsers];

  getAllUsers({ page = 0, limit = 10, sort = '', order = 'asc' }) {
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    let sortedUsers = [...this.users];
    if (sort) {
      const direction = order === 'asc' ? 1 : -1;
      sortedUsers = sortedUsers.sort((a, b) => {
        return a[sort] > b[sort] ? direction : -direction;
      });
    }
    return sortedUsers.slice(startIndex, endIndex);
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
    };
    this.users.push(newUser);
    return newUser;
  }
}
