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
} from '@nestjs/common';
import { TransformResponseInterceptor } from '../../common/interceptor/transform-response-interceptor.interceptor';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderType } from '../../common/utils/types';
import { AdminGuard } from '../../auth/guard/admin.guard';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { SuperAdminGuard } from '../../auth/guard/super-admin.guard';
import { QueryOrderDto } from '../dto/query-order.dto';

@Controller('order')
@UseInterceptors(TransformResponseInterceptor)
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(@Body() createOrderDto: CreateOrderDto): OrderType {
    try {
      this.logger.log(`Creating order for user: ${createOrderDto.userId}`);
      return this.orderService.createOrder(createOrderDto);
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
  getAllOrders(@Query() query: QueryOrderDto): OrderType[] {
    try {
      this.logger.log('Fetching all orders with filters');
      return this.orderService.getAllOrders(query);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(`Failed to fetch orders: ${errorMessage}`, stackTrace);
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  @Get(':id')
  getOneOrder(@Param('id', ParseIntPipe) id: number): OrderType {
    try {
      this.logger.log(`Fetching order with ID: ${id}`);
      return this.orderService.getOneOrder(id);
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

  @UseGuards(AdminGuard)
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

  @UseGuards(SuperAdminGuard)
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
