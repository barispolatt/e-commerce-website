import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import {
  PaginationOptions,
  SortOrder,
  UserRole,
  UserType,
} from '../../common/utils/types';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConvertIsoToDatePipe } from '../pipe/convert-iso-to-date.pipe';
import { SuperAdminGuard } from '../../auth/guard/super-admin.guard';
import { ResponseInterceptor } from '../../common/interceptor/response.interceptor';
import { CapitalizeNamePipe } from '../../common/pipe/capitilize-name.pipe';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users') // localhost:3000/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    this.usersService = usersService;
  }

  @Get()
  @UseInterceptors(ResponseInterceptor)
  getAllUsers(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: string,
    @Query('order') order: SortOrder,
  ): UserType[] {
    const options: PaginationOptions = {
      page: +page,
      limit: +limit,
      sort,
      order,
    };
    return this.usersService.getAllUsers(options);
  }
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
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
  @UseGuards(SuperAdminGuard)
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.deleteUserByID(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
  @Post('signup')
  @UsePipes(CapitalizeNamePipe)
  createUser(@Body(ConvertIsoToDatePipe) newUser: CreateUserDto) {
    return this.usersService.createUser(newUser);
  }
  @Put(':id')
  @UseGuards(SuperAdminGuard)
  @UsePipes(CapitalizeNamePipe)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): UserType {
    const user = this.usersService.updateUser(id, updateUserDto);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
  @Patch(':id/role')
  @UseGuards(SuperAdminGuard)
  updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: UserRole,
  ): UserType {
    const user = this.usersService.updateUser(id, { role });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
  @Get(':email')
  @UseInterceptors(ResponseInterceptor)
  async getUserByEmail(@Param('email') email: string): Promise<UserType> {
    const user: UserType | null = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
