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
  findAll(
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
  }
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.getUserById(id);
  }
  @Get(':id/comments/:commentId')
  getUserCommentsById(
    @Param('id', ParseIntPipe) id: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    console.log(id);
    console.log(commentId);
    const result = this.usersService.getUserCommentsById(id);
  }
  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.deleteUserByID(id);
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
  ) {
    const user = this.usersService.updateUser(id, updateUserDto);
  }
  @Patch(':id/role')
  @UseGuards(SuperAdminGuard)
  updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: UserRole,
  ) {
    const user = this.usersService.updateUser(id, { role });
  }
}
