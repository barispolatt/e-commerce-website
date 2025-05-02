import { Injectable } from '@nestjs/common';
import { PaginationOptions } from '../../common/utils/types';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly entityManager: EntityManager) {}

  async findAll(options: PaginationOptions) {
    return await this.entityManager.find(User, {
      where: { isActive: true },
      order: { id: 'ASC' },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = new User(createUserDto);
    const savedUser = await this.entityManager.save(newUser);
    console.log(`User created: ${savedUser.id}`);
    return savedUser;
  }
  getUserById(id: number) {}

  deleteUserByID(id: number) {}

  getUserCommentsById(id: number) {}

  updateUser(id: number, updateUserDto: UpdateUserDto) {}
}
