import { Injectable, NotFoundException } from '@nestjs/common';
import { dummyProducts } from '../../common/utils/data';
import { PaginationOptions, ProductType } from '../../common/utils/types';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  private products = [...dummyProducts];

  getAllProducts(options: PaginationOptions): ProductType[] {
    const { page = 1, limit = 10, sort = 'id', order = 'asc' } = options;
    // Sort and paginate
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Sort and paginate
    return [...this.products]
      .sort((a, b) => {
        if (a[sort] < b[sort]) return order === 'asc' ? -1 : 1;
        if (a[sort] > b[sort]) return order === 'asc' ? 1 : -1;
        return 0;
      })
      .slice(startIndex, endIndex);
  }

  getProductById(id: number) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  createProduct(createProductDto: CreateProductDto) {
    const maxId = Math.max(...this.products.map((product) => product.id));

    const newProduct = {
      id: maxId + 1,
      ...createProductDto,
      rating: 0,
      sell_count: 0,
      images: createProductDto.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );

    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const existingProduct = this.products[productIndex];

    const updatedProduct = {
      ...existingProduct,
      ...updateProductDto,
      updatedAt: new Date().toISOString(),
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  deleteProduct(id: number) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );

    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const deletedProduct = this.products[productIndex];
    this.products.splice(productIndex, 1);

    return deletedProduct;
  }

  // Additional methods specific to products
  getProductsByCategory(categoryId: number, options: PaginationOptions) {
    const filteredProducts = this.products.filter(
      (product) => product.category_id === categoryId,
    );

    const { page = 1, limit = 10, sort = 'id', order = 'asc' } = options;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return [...filteredProducts]
      .sort((a, b) => {
        if (a[sort] < b[sort]) return order === 'asc' ? -1 : 1;
        if (a[sort] > b[sort]) return order === 'asc' ? 1 : -1;
        return 0;
      })
      .slice(startIndex, endIndex);
  }

  searchProducts(query: string, options: PaginationOptions) {
    const searchStr = query.toLowerCase();

    const filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchStr) ||
        product.description.toLowerCase().includes(searchStr),
    );

    const { page = 1, limit = 10, sort = 'id', order = 'asc' } = options;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return [...filteredProducts]
      .sort((a, b) => {
        if (a[sort] < b[sort]) return order === 'asc' ? -1 : 1;
        if (a[sort] > b[sort]) return order === 'asc' ? 1 : -1;
        return 0;
      })
      .slice(startIndex, endIndex);
  }
}
