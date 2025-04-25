export type SortOrder = 'asc' | 'desc';
export type PaginationOptions = {
  page: number;
  limit: number;
  sort: string;
  order: SortOrder;
};
export enum UserRole {
  GUEST = 4,
  USER = 3,
  ADMIN = 2,
  SUPER_ADMIN = 1,
}
export type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  role: UserRole;
  birthdate: string;
  createdAt?: string;
  updatedAt?: string;
};
export type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  store_id: number;
  category_id: number;
  rating: number;
  sell_count: number;
  images: {
    url: string;
    index: number;
  }[];
};
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
export type OrderProductType = {
  productId: number;
  quantity: number;
  unitPrice: number;
};
export type OrderType = {
  id: number;
  userId: number;
  products: OrderProductType[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
};
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  CRYPTO = 'crypto',
}

export type PaymentType = {
  id: number;
  orderId: number;
  userId: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};
