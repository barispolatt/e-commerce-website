import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatus, PaymentType } from '../../common/utils/types';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { QueryPaymentDto } from '../dto/query-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class PaymentService {
  private payments: PaymentType[] = [];
  private nextId = 1;

  createPayment(createPaymentDto: CreatePaymentDto): PaymentType {
    const newPayment: PaymentType = {
      id: this.nextId++,
      orderId: createPaymentDto.orderId,
      userId: createPaymentDto.userId,
      amount: createPaymentDto.amount,
      method: createPaymentDto.method,
      status: PaymentStatus.PENDING,
      transactionId: createPaymentDto.transactionId || `TRX-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.payments.push(newPayment);
    return newPayment;
  }

  getAllPayments(queryParams: QueryPaymentDto): PaymentType[] {
    const page = queryParams.page ?? 1;
    const limit = queryParams.limit ?? 10;
    const sort = queryParams.sort ?? 'createdAt';
    const order = queryParams.order ?? 'desc';
    const status = queryParams.status;
    const method = queryParams.method;
    const userId = queryParams.userId;
    const orderId = queryParams.orderId;

    let filteredPayments = [...this.payments];

    // Apply filters
    if (status) {
      filteredPayments = filteredPayments.filter((p) => p.status === status);
    }

    if (method) {
      filteredPayments = filteredPayments.filter((p) => p.method === method);
    }

    if (userId) {
      filteredPayments = filteredPayments.filter((p) => p.userId === userId);
    }

    if (orderId) {
      filteredPayments = filteredPayments.filter((p) => p.orderId === orderId);
    }

    filteredPayments.sort((a, b) => {
      const valueA = a[sort as keyof PaymentType];
      const valueB = b[sort as keyof PaymentType];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order.toLowerCase() === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return order.toLowerCase() === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }

      // Default return for incomparable types
      return 0;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return filteredPayments.slice(startIndex, endIndex);
  }

  getOnePayment(id: number): PaymentType {
    const payment = this.payments.find((payment) => payment.id === id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  getPaymentsByOrderId(orderId: number): PaymentType[] {
    const payments = this.payments.filter(
      (payment) => payment.orderId === orderId,
    );
    return payments;
  }

  updatePayment(id: number, updatePaymentDto: UpdatePaymentDto): PaymentType {
    const paymentIndex = this.payments.findIndex(
      (payment) => payment.id === id,
    );
    if (paymentIndex === -1) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    const existingPayment = this.payments[paymentIndex];

    const updatedPayment: PaymentType = {
      ...existingPayment,
      ...updatePaymentDto,
      updatedAt: new Date().toISOString(),
    };

    this.payments[paymentIndex] = updatedPayment;
    return updatedPayment;
  }

  processPayment(id: number): PaymentType {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payment = this.getOnePayment(id);

    // Simulate payment processing
    const isSuccess = Math.random() > 0.2; // 80% success rate

    const updatedPayment = this.updatePayment(id, {
      status: isSuccess ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
    });

    return updatedPayment;
  }

  refundPayment(id: number): PaymentType {
    const payment = this.getOnePayment(id);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new Error('Only completed payments can be refunded');
    }

    const updatedPayment = this.updatePayment(id, {
      status: PaymentStatus.REFUNDED,
    });

    return updatedPayment;
  }

  removePayment(id: number): void {
    const paymentIndex = this.payments.findIndex(
      (payment) => payment.id === id,
    );
    if (paymentIndex === -1) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    this.payments.splice(paymentIndex, 1);
  }
}
