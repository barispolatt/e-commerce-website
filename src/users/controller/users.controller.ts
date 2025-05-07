import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: string,
    @Query('order') order: SortOrder,
  ) {
    const options: PaginationOptions = {
      page: +page,
      limit: +limit,
      sort,
      order,
    };
    const users = await this.usersService.findAll(options);
    console.log('users: ', users);
    return users;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }

  //@Get(':id/comments/:commentId')
  //getUserCommentsById(
  //  @Param('id', ParseIntPipe) id: number,
  //  @Param('commentId', ParseIntPipe) commentId: number,
  //) {
  //  console.log(id);
  //  console.log(commentId);
  //  const result = this.usersService.getUserCommentsById(id);
  //}
  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }

  @Post('register')
  @UsePipes(CapitalizeNamePipe)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body(ConvertIsoToDatePipe) createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @UseGuards(SuperAdminGuard)
  @UsePipes(CapitalizeNamePipe)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.updateUser(id, updateUserDto);
    if (!user) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    return user;
  }

  @Patch(':id/role')
  @UseGuards(SuperAdminGuard)
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: UserRole,
  ) {
    const user = await this.usersService.updateUser(id, { role });
    if (!user)
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
    return user;
  }
}
