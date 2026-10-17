# Charity Organization Backend API (NestJS + MySQL 8.0 + JWT + Passport.js)

A production-ready, modular NestJS backend built with **MySQL 8.0**, **TypeORM**, **Passport.js & JWT Authentication**, **Swagger OpenAPI**, and **Multer File Uploads**.

---

## 📋 Table of Contents
1. [Key Features](#-key-features)
2. [Architecture Overview](#-architecture-overview)
3. [Environment Configuration (.env)](#-environment-configuration-env)
4. [Installation & Running](#-installation--running)
5. [Interactive Swagger API Docs](#-interactive-swagger-api-docs)
6. [API Endpoints Summary](#-api-endpoints-summary)
   - [1. Authentication & Admin](#1-authentication--admin)
   - [2. Volunteer Registration & Management](#2-volunteer-registration--management)
   - [3. Volunteer & Dashboard Statistics](#3-volunteer--dashboard-statistics)
   - [4. Website Content & Site Settings (CMS)](#4-website-content--site-settings-cms)
   - [5. Contact Messages](#5-contact-messages)
   - [6. Media & File Uploads](#6-media--file-uploads)
7. [Default Seed Data](#-default-seed-data)

---

## 🌟 Key Features

- **Admin Authentication**: Secure JWT + Passport strategy with bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Support for `SUPER_ADMIN`, `ADMIN`, and `MODERATOR`.
- **Volunteer Registration & Lifecycle Management**:
  - Public registration portal supporting personal details, skills, interests, and document uploads (ID, CV, Photo).
  - Status management: `PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `INACTIVE`.
  - Comprehensive filtering by status, skills, city, keyword search, and pagination.
- **Volunteer & Dashboard Statistics**: Real-time aggregated metrics, status distributions, percentages, and activity logs.
- **Website CMS**:
  - Manage **About Us**, **Programs/Projects**, **Events**, **News**, **Announcements**, and **Gallery** (Images, Videos, Audios).
  - Bilingual support (**English** & **Amharic** / `titleAm`, `contentAm`).
  - Dynamic **Organization Site Settings** (phone, emails, address, social media links, donation bank accounts).
- **Contact & Inquiries**: Store inquiries with `UNREAD`, `READ`, `REPLIED`, `ARCHIVED` status and internal admin notes.
- **Media Uploads**: Multer disk storage for files with static serving at `/uploads/*`.
- **Auto Database Seeder**: Automatically initializes Super Admin and rich sample content on first run.

---

## 🏗️ Architecture Overview

```
backend/
├── src/
│   ├── common/                    # Shared filters, guards, decorators, enums, and DTOs
│   │   ├── decorators/            # @Public(), @Roles(), @CurrentUser()
│   │   ├── dto/                   # PaginationDto
│   │   ├── enums/                 # VolunteerStatus, AdminRole, ContentType, MessageStatus
│   │   ├── filters/               # HttpExceptionFilter
│   │   ├── guards/                # JwtAuthGuard, RolesGuard
│   │   └── interceptors/          # TransformInterceptor
│   ├── modules/
│   │   ├── admin/                 # Admin user CRUD and profile management
│   │   ├── auth/                  # JWT auth, login, and password management
│   │   ├── content/               # CMS for Programs, Events, News, Gallery & Site Settings
│   │   ├── database/              # Database Seeder on application startup
│   │   ├── messages/              # Contact form inquiries & admin moderation
│   │   ├── statistics/            # Volunteer analytics & Admin dashboard summary
│   │   ├── upload/                # Single/Multiple file uploads
│   │   └── volunteers/            # Volunteer registration & status transitions
│   ├── app.module.ts              # Root TypeORM & feature configuration
│   └── main.ts                    # Bootstrap, CORS, ValidationPipe, Swagger setup
├── uploads/                       # Directory for uploaded media & documents
├── schema.sql                     # MySQL 8.0 schema definition
├── .env                           # Environment variables
├── tsconfig.json
└── package.json
```

---

## ⚙️ Environment Configuration (`.env`)

Configure your MySQL connection in `backend/.env`:

```ini
PORT=3000
NODE_ENV=development

# MySQL 8.0 Database
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=charity_db
DB_SYNCHRONIZE=true
DB_LOGGING=false

# JWT Authentication
JWT_SECRET=charity_jwt_secret_key_2026_super_secure_token!@#$
JWT_EXPIRES_IN=7d

# Initial Super Admin (Auto-created if database is empty)
DEFAULT_ADMIN_EMAIL=admin@charity.org
DEFAULT_ADMIN_PASSWORD=Admin123!
DEFAULT_ADMIN_NAME=Super Administrator

# Uploads
UPLOAD_DEST=./uploads
```

---

## 🚀 Installation & Running

### 1. Make sure MySQL is running and the database exists:
```sql
CREATE DATABASE IF NOT EXISTS charity_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Start the Backend:
```bash
# Navigate to backend folder
cd backend

# Run development server with hot-reload
npm run start:dev

# Or build and run production bundle
npm run build
npm run start:prod
```

---

## 📖 Interactive Swagger API Docs

Once running, visit:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

You can test all endpoints, authenticate via JWT token, and inspect schemas interactively in your browser.

---

## 📡 API Endpoints Summary

### 1. Authentication & Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Admin login, returns JWT `accessToken` |
| `GET` | `/api/auth/me` | Admin | Get current admin profile |
| `POST` | `/api/auth/change-password` | Admin | Update current admin password |
| `GET` | `/api/admin/users` | Super Admin | List all admins (paginated) |
| `POST` | `/api/admin/users` | Super Admin | Create a new admin user |
| `GET` | `/api/admin/users/:id` | Super Admin | Get single admin details |
| `PATCH` | `/api/admin/users/:id` | Super Admin | Update admin details / role / status |
| `DELETE` | `/api/admin/users/:id` | Super Admin | Delete admin account |

---

### 2. Volunteer Registration & Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/volunteers/register` | Public | Submit volunteer application |
| `GET` | `/api/volunteers` | Admin | List volunteers (filters: `status`, `skill`, `areaOfInterest`, `city`, `search`, pagination) |
| `GET` | `/api/volunteers/:id` | Admin | Get volunteer profile by ID |
| `PATCH` | `/api/volunteers/:id/status` | Admin | Change status (`PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `INACTIVE`) + notes |
| `PATCH` | `/api/volunteers/:id` | Admin | Update volunteer details |
| `DELETE` | `/api/volunteers/:id` | Admin | Delete volunteer registration |
| `GET` | `/api/volunteers/statistics` | Admin | Summary counts & status percentages |

---

### 3. Volunteer & Dashboard Statistics
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/statistics/dashboard` | Admin | Complete overview: Total volunteers, pending, active, programs, events, news, unread messages |
| `GET` | `/api/statistics/volunteers` | Admin | Detailed status distribution & recent volunteer registrations |

---

### 4. Website Content & Site Settings (CMS)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/content/public/about` | Public | Get About Us story and team info |
| `GET` | `/api/content/public/programs` | Public | Get published charity programs/projects |
| `GET` | `/api/content/public/events` | Public | Get published upcoming events |
| `GET` | `/api/content/public/news` | Public | Get published news articles |
| `GET` | `/api/content/public/announcements` | Public | Get published announcements |
| `GET` | `/api/content/public/gallery` | Public | Get gallery media (Photos, Videos, Audios) |
| `GET` | `/api/content/public/settings` | Public | Get organization contact details & settings |
| `GET` | `/api/content/public/item/:id` | Public | Get single content item by ID |
| `GET` | `/api/content/admin/list` | Admin | List all items with CMS filters and pagination |
| `POST` | `/api/content/admin/item` | Admin | Create new content (Program, Event, News, Gallery) |
| `PUT` | `/api/content/admin/item/:id` | Admin | Update content item |
| `DELETE` | `/api/content/admin/item/:id` | Admin | Delete content item |
| `PATCH` | `/api/content/admin/item/:id/toggle-publish` | Admin | Toggle published / unpublished |
| `POST` | `/api/content/admin/settings` | Admin | Update individual site setting |
| `PUT` | `/api/content/admin/settings/bulk` | Admin | Bulk update organization settings |
| `GET` | `/api/content/admin/stats` | Admin | Content count breakdown by type |

---

### 5. Contact Messages
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/messages` | Public | Submit contact form inquiry |
| `GET` | `/api/messages` | Admin | List messages (filters: `status`, `search`, pagination) |
| `GET` | `/api/messages/stats` | Admin | Counts: Total, Unread, Read, Replied, Archived |
| `GET` | `/api/messages/:id` | Admin | View message details |
| `PATCH` | `/api/messages/:id/status` | Admin | Update status (`UNREAD`, `READ`, `REPLIED`, `ARCHIVED`) |
| `PATCH` | `/api/messages/:id/note` | Admin | Add internal admin note to message |
| `DELETE` | `/api/messages/:id` | Admin | Delete message |

---

### 6. Media & File Uploads
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/upload/file` | Public/Admin | Upload single file (Photo, CV, Document, Media) |
| `POST` | `/api/upload/multiple` | Admin | Upload batch of files (e.g. Gallery images) |
| `GET` | `/uploads/{filename}` | Public | Access static uploaded media directly |

---

## 🔑 Default Seed Data

When the server runs for the first time, it automatically creates:

- **Super Admin Account**:
  - **Email**: `admin@charity.org`
  - **Password**: `Admin123!`
  - **Role**: `SUPER_ADMIN`
- **Initial Organization Settings**:
  - Organization name (EN & Amharic), phone numbers, email, physical address, and donation accounts (CBE, Telebirr).
- **Sample Content Items**:
  - 1 About story, 2 Charity Programs, 1 Charity Event, 1 News article, 1 Announcement, and 2 Gallery items.
- **Sample Volunteer Records**:
  - 5 volunteer records showcasing `PENDING`, `APPROVED`, `ACTIVE`, and `INACTIVE` statuses.
- **Sample Inquiries**:
  - 3 contact inquiries showcasing `UNREAD`, `READ`, and `REPLIED` states.
