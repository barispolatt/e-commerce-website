import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationOptions } from '../../common/utils/types';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    //@InjectRepository(Comment)
    //private readonly commentRepository: Repository<Comment>,
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
    const newUser = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(newUser);
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
    return new UserResponseDto({
      id: user.id,
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

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

    return new UserResponseDto({
      id: user.id,
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
    });
  }

  //async getCommentsById(id: number): Promise<Comment[]> {
  // First check if the user exists
  //const user = await this.userRepository.findOne({
  // where: { id },
  //});
  //if (!user) {
  // throw new HttpException(
  // `User with id ${id} not found`,
  // HttpStatus.NOT_FOUND,
  //);
  //}
  //const comments = await this.commentRepository.find({
  // where: { user: { id } },
  //relations: ['user'],
  //});

  //return comments;
  //}

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }
}
