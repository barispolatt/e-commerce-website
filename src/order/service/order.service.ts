import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import {
  OrderProductType,
  OrderStatus,
  OrderType,
} from '../../common/utils/types';
import { QueryOrderDto } from '../dto/query-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class OrderService {
  private orders: OrderType[] = [];
  private nextId = 1;

  createOrder(createOrderDto: CreateOrderDto): OrderType {
    const newOrder: OrderType = {
      id: this.nextId++,
      userId: createOrderDto.userId,
      products: createOrderDto.products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        unitPrice: Math.floor(Math.random() * 100) + 1, // Mock price for now
      })),
      totalAmount: 0, // Will be calculated
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calculate total amount
    newOrder.totalAmount = newOrder.products.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    this.orders.push(newOrder);
    return newOrder;
  }

  getAllOrders(queryParams: QueryOrderDto): OrderType[] {
    const page = queryParams.page ?? 1;
    const limit = queryParams.limit ?? 10;
    const sort = queryParams.sort ?? 'createdAt';
    const order = queryParams.order ?? 'desc';
    const status = queryParams.status;
    const userId = queryParams.userId;

    let filteredOrders = [...this.orders];

    // Apply filters
    if (status) {
      filteredOrders = filteredOrders.filter((o) => o.status === status);
    }

    if (userId) {
      filteredOrders = filteredOrders.filter((o) => o.userId === userId);
    }

    filteredOrders.sort((a, b) => {
      const valueA = a[sort as keyof OrderType];
      const valueB = b[sort as keyof OrderType];

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
      return 0;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return filteredOrders.slice(startIndex, endIndex);
  }

  getOneOrder(id: number): OrderType {
    const order = this.orders.find((order) => order.id === id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  updateOrder(id: number, updateOrderDto: UpdateOrderDto): OrderType {
    const orderIndex = this.orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const existingOrder = this.orders[orderIndex];

    const { products, ...otherUpdates } = updateOrderDto;

    const updatedOrder: OrderType = {
      ...existingOrder,
      ...otherUpdates,
      updatedAt: new Date().toISOString(),
    };

    if (products) {
      const updatedProducts: OrderProductType[] = products.map((product) => {
        const existingProduct = existingOrder.products.find(
          (p) => p.productId === product.productId,
        );

        return {
          productId: product.productId,
          quantity: product.quantity,
          unitPrice:
            existingProduct?.unitPrice || Math.floor(Math.random() * 100) + 1,
        };
      });

      updatedOrder.products = updatedProducts;

      updatedOrder.totalAmount = updatedProducts.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );
    }

    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }

  removeOrder(id: number): void {
    const orderIndex = this.orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    this.orders.splice(orderIndex, 1);
  }
}
