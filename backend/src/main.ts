import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Ensure uploads directory exists
  const uploadDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Copy workspace images to uploads if available
  try {
    const parentDir = path.resolve(process.cwd(), '..');
    const existingMedia = [
      '20250828_151315.jpg',
      '20250828_161110.jpg',
      '20250828_161128.jpg',
      '20250828_161207.jpg',
      '20250828_161243.jpg',
      '20250828_170614.jpg',
      'els1.jpg',
      'els2.jpg',
      'elshaday.jpg',
      'elogo.png',
      'austin-kehmeier-lyiKExA4zQA-unsplash.jpg',
    ];
    for (const file of existingMedia) {
      const srcPath = path.join(parentDir, file);
      const destPath = path.join(uploadDir, file);
      if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } catch (err) {
    // Ignore optional media copy
  }

  // Enable CORS for frontend integration
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global API Prefix
  app.setGlobalPrefix('api');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter & Transform Interceptor
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // Swagger OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Elshaday Charity Backend API')
    .setDescription(
      `RESTful API documentation for Volunteer Registration, Content CMS, Admin Dashboard, Messages, and Statistics.\n\n` +
      `### Default Super Admin Credentials:\n` +
      `- **Email**: \`${configService.get('DEFAULT_ADMIN_EMAIL', 'admin@charity.org')}\`\n` +
      `- **Password**: \`${configService.get('DEFAULT_ADMIN_PASSWORD', 'Admin123!')}\`\n\n` +
      `To test protected endpoints:\n` +
      `1. Execute **POST /api/auth/login** with credentials.\n` +
      `2. Copy \`accessToken\` from response.\n` +
      `3. Click the **Authorize 🔓** button at the top right, paste token as \`Bearer <token>\` or just \`<token>\`, and click Authorize.`,
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearer',
    )
    .addTag('Authentication', 'Admin login, profile, and password management')
    .addTag('Admin Management', 'Super Admin management of other admin users')
    .addTag('Volunteers', 'Volunteer registration, status approvals, search and filtering')
    .addTag('Admin Statistics & Dashboard', 'Real-time counts, percentages, and analytics overview')
    .addTag('Website Content & Settings', 'About, Programs, Events, News, Announcements, Gallery, and Site Settings')
    .addTag('Contact Messages', 'Public contact submission and admin message management')
    .addTag('Media & File Uploads', 'Single and multiple file uploads for media and documents')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
    },
    customSiteTitle: 'Charity Portal API Documentation',
  });

  await app.listen(port);

  logger.log(`================================================================`);
  logger.log(`🚀 Server is running on: http://localhost:${port}/api`);
  logger.log(`📚 Swagger API Docs:      http://localhost:${port}/api/docs`);
  logger.log(`🖼️  Uploaded files:       http://localhost:${port}/uploads/`);
  logger.log(`================================================================`);
}
bootstrap();
