/**
 * Dependency Injection Container.
 * 
 * This module allows for:
 * 1. Centralized configuration of all services and repositories.
 * 2. Easy testing by swapping dependencies.
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
import { SettingsRepository } from './repositories/settingsRepository.js';
import { ReturnRepository } from './repositories/returnRepository.js';

// Services
import { ProductService } from './services/productService.js';
import { CategoryService } from './services/categoryService.js';
import { OrderService } from './services/orderService.js';
import { ParamService } from './services/paramService.js';
import { IyzicoService } from './services/iyzicoService.js';
import { PaytrService } from './services/paytrService.js';
import { PaymentService } from './services/paymentService.js';
import { EmailService } from './services/emailService.js';
import { BrandService } from './services/brandService.js';
import { SettingsService } from './services/settingsService.js';
import { ReturnService } from './services/returnService.js';

// Controllers
import { ProductController } from './controllers/productController.js';
import { CategoryController } from './controllers/categoryController.js';
import { OrderController } from './controllers/orderController.js';
import { PaymentController } from './controllers/paymentController.js';
import { BrandController } from './controllers/brandController.js';
import { SettingsController } from './controllers/settingsController.js';
import { ReturnController } from './controllers/returnController.js';
import { SeoController } from './controllers/seoController.js';
import { FeedController } from './controllers/feedController.js';
import { UploadController } from './controllers/uploadController.js';

// === INSTANTIATION ===

// Repositories
const productRepository = new ProductRepository(prisma);
const categoryRepository = new CategoryRepository(prisma);
const orderRepository = new OrderRepository(prisma);
const brandRepository = new BrandRepository(prisma);
const settingsRepository = new SettingsRepository(prisma);
const returnRepository = new ReturnRepository(prisma);

// Infrastructure Services
const paramService = new ParamService(config.param);
const iyzicoService = new IyzicoService(config.iyzico);
const paytrService = new PaytrService(config.paytr);
const paymentService = new PaymentService(paramService, iyzicoService, paytrService, config);
const emailService = new EmailService(config.brevo.smtp);

// Domain Services
const productService = new ProductService(productRepository, categoryRepository);
const categoryService = new CategoryService(categoryRepository);
const settingsService = new SettingsService(settingsRepository);
const returnService = new ReturnService(returnRepository, orderRepository);
const orderService = new OrderService(orderRepository, productService, paymentService, emailService);
const brandService = new BrandService(brandRepository);

// Controllers
const productController = new ProductController(productService);
const categoryController = new CategoryController(categoryService);
const orderController = new OrderController(orderService);
const paymentController = new PaymentController(orderService);
const brandController = new BrandController(brandService);
const settingsController = new SettingsController(settingsService);
const returnController = new ReturnController(returnService);
const seoController = new SeoController(productRepository);
const feedController = new FeedController(productRepository);
const uploadController = new UploadController();

// === EXPORTS ===

export {
    productController,
    categoryController,
    orderController,
    paymentController,
    brandController,
    settingsController,
    returnController,
    seoController,
    feedController,
    uploadController
};
