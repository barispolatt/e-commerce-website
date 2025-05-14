import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UsePipes,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import {
  PaginationOptions,
  SortOrder,
  UserRole,
} from '../../common/utils/types';
import { CapitalizeNamePipe } from '../../common/pipe/capitilize-name.pipe';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorator/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sort') sort = 'id',
    @Query('order') order: SortOrder = 'asc',
  ) {
    const options: PaginationOptions = {
      page: +page,
      limit: +limit,
      sort,
      order,
    };
    return this.productsService.getAllProducts(options);
  }

  @Get('search')
  searchProducts(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sort') sort = 'id',
    @Query('order') order: SortOrder = 'asc',
  ) {
    const options: PaginationOptions = {
      page: +page,
      limit: +limit,
      sort,
      order,
    };
    const products = this.productsService.searchProducts(query, options);
    if (!products || products.length === 0) {
      throw new HttpException(
        'No products found in this category',
        HttpStatus.BAD_REQUEST,
      );
    }
    return products;
  }

  @Get('category/:category_id')
  getProductsByCategory(
    @Param('category_id', ParseIntPipe) category_id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sort') sort = 'id',
    @Query('order') order: SortOrder = 'asc',
  ) {
    const options: PaginationOptions = {
      page: +page,
      limit: +limit,
      sort,
      order,
    };
    console.log(category_id);
    return this.productsService.getProductsByCategory(category_id, options);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    const product = this.productsService.getProductById(id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
    }
    return product;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @UsePipes(CapitalizeNamePipe)
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @UsePipes(CapitalizeNamePipe)
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = this.productsService.updateProduct(
      id,
      updateProductDto,
    );
    if (!updatedProduct) {
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
    }
    return updatedProduct;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const deleted = this.productsService.deleteProduct(id);
    if (!deleted) {
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
    }
    return deleted;
  }
}
