/**
 * Dependency Injection Container.
 * 
 * This module allows for:
 * 1. Centralized configuration of all services and repositories.
 * 2. Easy testing by swapping dependencies (though currently hardwired here).
 * 3. Adherence to Dependency Inversion Principle (DIP).
 */

// === IMPORTS ===

// Core
import prisma from './prisma.js';
import { config } from './config.js';

// Repositories
import { ProductRepository } from './repositories/productRepository.js';
import { CategoryRepository } from './repositories/categoryRepository.js';
import { OrderRepository } from './repositories/orderRepository.js';
import { BrandRepository } from './repositories/brandRepository.js';

// Services
import { ProductService } from './services/productService.js';
import { CategoryService } from './services/categoryService.js';
import { OrderService } from './services/orderService.js';
import { ParamService } from './services/paramService.js';
import { EmailService } from './services/emailService.js';
import { BrandService } from './services/brandService.js';

// Controllers
import { ProductController } from './controllers/productController.js';
import { CategoryController } from './controllers/categoryController.js';
import { OrderController } from './controllers/orderController.js';
import { PaymentController } from './controllers/paymentController.js';
import { BrandController } from './controllers/brandController.js';

// === INSTANTIATION ===

// Repositories
const productRepository = new ProductRepository(prisma);
const categoryRepository = new CategoryRepository(prisma);
const orderRepository = new OrderRepository(prisma);
const brandRepository = new BrandRepository(prisma);

// Infrastructure Services
const paramService = new ParamService(config.param);
const emailService = new EmailService(config.brevo.smtp);

// Domain Services
const productService = new ProductService(productRepository, categoryRepository, prisma);
const categoryService = new CategoryService(categoryRepository);
const orderService = new OrderService(orderRepository, productService, paramService, emailService);
const brandService = new BrandService(brandRepository);

// Controllers
const productController = new ProductController(productService);
const categoryController = new CategoryController(categoryService);
const orderController = new OrderController(orderService);
const paymentController = new PaymentController(orderService);
const brandController = new BrandController(brandService);

// === EXPORTS ===

export {
    productController,
    categoryController,
    orderController,
    paymentController,
    brandController
};
