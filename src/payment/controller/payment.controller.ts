import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransformResponseInterceptor } from '../../common/interceptor/transform-response-interceptor.interceptor';
import { PaymentService } from '../service/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentType } from '../../common/utils/types';
import { QueryPaymentDto } from '../dto/query-payment.dto';
import { AdminGuard } from '../../auth/guard/admin.guard';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { SuperAdminGuard } from '../../auth/guard/super-admin.guard';

@Controller('payment')
@UseInterceptors(TransformResponseInterceptor)
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPayment(@Body() createPaymentDto: CreatePaymentDto): PaymentType {
    try {
      this.logger.log(
        `Creating payment for order: ${createPaymentDto.orderId}`,
      );
      return this.paymentService.createPayment(createPaymentDto);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to create payment: ${errorMessage}`,
        stackTrace,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create payment');
    }
  }

  @Get()
  getAllPayments(@Query() query: QueryPaymentDto): PaymentType[] {
    try {
      this.logger.log('Fetching all payments with filters');
      return this.paymentService.getAllPayments(query);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to fetch payments: ${errorMessage}`,
        stackTrace,
      );
      throw new InternalServerErrorException('Failed to fetch payments');
    }
  }

  @Get('order/:orderId')
  getPaymentsByOrderId(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): PaymentType[] {
    try {
      this.logger.log(`Fetching payments for order ID: ${orderId}`);
      return this.paymentService.getPaymentsByOrderId(orderId);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to fetch payments for order ${orderId}: ${errorMessage}`,
        stackTrace,
      );
      throw new InternalServerErrorException(
        `Failed to fetch payments for order ID ${orderId}`,
      );
    }
  }

  @Get(':id')
  getOnePayment(@Param('id', ParseIntPipe) id: number): PaymentType {
    try {
      this.logger.log(`Fetching payment with ID: ${id}`);
      return this.paymentService.getOnePayment(id);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to fetch payment ${id}: ${errorMessage}`,
        stackTrace,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch payment with ID ${id}`,
      );
    }
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): PaymentType {
    try {
      this.logger.log(`Updating payment with ID: ${id}`);
      return this.paymentService.updatePayment(id, updatePaymentDto);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to update payment ${id}: ${errorMessage}`,
        stackTrace,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update payment with ID ${id}`,
      );
    }
  }

  @UseGuards(AdminGuard)
  @Patch(':id/process')
  processPayment(@Param('id', ParseIntPipe) id: number): PaymentType {
    try {
      this.logger.log(`Processing payment with ID: ${id}`);
      return this.paymentService.processPayment(id);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to process payment ${id}: ${errorMessage}`,
        stackTrace,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to process payment with ID ${id}`,
      );
    }
  }

  @UseGuards(AdminGuard)
  @Patch(':id/refund')
  refundPayment(@Param('id', ParseIntPipe) id: number): PaymentType {
    try {
      this.logger.log(`Refunding payment with ID: ${id}`);
      return this.paymentService.refundPayment(id);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to refund payment ${id}: ${errorMessage}`,
        stackTrace,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to refund payment with ID ${id}`,
      );
    }
  }

  @UseGuards(SuperAdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removePayment(@Param('id', ParseIntPipe) id: number): void {
    try {
      this.logger.log(`Removing payment with ID: ${id}`);
      return this.paymentService.removePayment(id);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to remove payment ${id}: ${errorMessage}`,
        stackTrace,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to remove payment with ID ${id}`,
      );
    }
  }
}
