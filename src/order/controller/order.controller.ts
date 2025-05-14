import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UseInterceptors,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { TransformResponseInterceptor } from '../../common/interceptor/transform-response-interceptor.interceptor';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderType, UserRole } from '../../common/utils/types';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { QueryOrderDto } from '../dto/query-order.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorator/roles.decorator';
import { User } from '../../users/entities/user.entity';

@Controller('order')
@UseInterceptors(TransformResponseInterceptor)
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.SELLER)
  @HttpCode(HttpStatus.CREATED)
  createOrder(
    @Body() createOrderDto: Omit<CreateOrderDto, 'userId'>,
    @Req() request: { user: User },
  ): OrderType {
    try {
      const fullCreateOrderDto: CreateOrderDto = {
        ...createOrderDto,
        userId: request.user.id,
      };
      this.logger.log(`Creating order for user: ${fullCreateOrderDto.userId}`);
      return this.orderService.createOrder(fullCreateOrderDto);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(`Failed to create order: ${errorMessage}`, stackTrace);

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getAllOrders(
    @Query() query: QueryOrderDto,
    @Req() request: { user: User },
  ): OrderType[] {
    try {
      this.logger.log('Fetching all orders with filters');
      return this.orderService.getAllOrders(query, request.user);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(`Failed to fetch orders: ${errorMessage}`, stackTrace);
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getOneOrder(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: { user: User },
  ): OrderType {
    try {
      this.logger.log(`Order with ID: ${id}`);
      const order = this.orderService.getOneOrder(id);

      if (
        request.user.role !== UserRole.ADMIN &&
        request.user.role !== UserRole.SUPER_ADMIN &&
        order.userId !== request.user.id
      ) {
        throw new ForbiddenException('Not authorized.');
      }
      return order;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to fetch order ${id}: ${errorMessage}`,
        stackTrace,
      );

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): OrderType {
    try {
      this.logger.log(`Updating order with ID: ${id}`);
      return this.orderService.updateOrder(id, updateOrderDto);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to update order ${id}: ${errorMessage}`,
        stackTrace,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update order with ID ${id}`,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeOrder(@Param('id', ParseIntPipe) id: number): void {
    try {
      this.logger.log(`Removing order with ID: ${id}`);
      return this.orderService.removeOrder(id);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to remove order ${id}: ${errorMessage}`,
        stackTrace,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to remove order with ID ${id}`,
      );
    }
  }
}
