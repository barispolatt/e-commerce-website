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
