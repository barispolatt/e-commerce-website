import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationOptions } from '../../common/utils/types';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll({
    page = 0,
    limit = 5,
    sort = 'id',
    order = 'asc',
  }: PaginationOptions) {
    const offset = page * limit;
    const users = await this.userRepository
      .createQueryBuilder('user')
      .orderBy(`user.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return users.map(
      (user) =>
        new UserResponseDto({
          id: user.id,
          name: user.name,
          email: user.email,
          birthdate: user.birthdate,
        }),
    );
    //return await this.entityManager.find(User, {
    // where: { isActive: true },
    //order: { id: 'ASC' },
    //});
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = new User(createUserDto);
    const savedUser = await this.entityManager.save(newUser);
    console.log(`User created: ${savedUser.id}`);
    return savedUser;
  }
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const userResponse = new UserResponseDto({
      id: user.id,
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
    });
    return userResponse;
  }

  deleteUserByID(id: number, updateUserDto: UpdateUserDto) {}

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userRepository.delete(id);
    const userResponse = new UserResponseDto({
      id: user.id,
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
    });
    return userResponse;
  }
  getUserCommentsById(id: number) {}

  updateUser(id: number, updateUserDto: UpdateUserDto) {}
}
