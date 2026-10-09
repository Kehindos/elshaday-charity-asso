# Elshaday Charity Organization — Comprehensive Project & Implementation Documentation
**Version:** 1.0.0 | **Organization:** Elshaday Charity Organization (ኤልሻዳይ የበጎ አድራጎት ድርጅት)  
**Location:** Wolyta Sodo, Ethiopia (Buge Sub-city) | **Phone:** +251 934 287 380  
**Banking:** CBE Account `1000722573138` (Izra, Bedilu and Asteway) | Telebirr: `+251 934 287 380`  
**GitHub Repository:** [https://github.com/Kehindos/elshaday-charity-asso](https://github.com/Kehindos/elshaday-charity-asso)

---

## 📑 Table of Contents
1. [Executive Summary & Project Overview](#1-executive-summary--project-overview)
2. [Technology Stack & System Architecture](#2-technology-stack--system-architecture)
3. [Database Architecture & Schema Design](#3-database-architecture--schema-design)
4. [Backend RESTful API Specification](#4-backend-restful-api-specification)
5. [Frontend Design System & Mobile UX Architecture](#5-frontend-design-system--mobile-ux-architecture)
6. [Security, Authentication & Role-Based Access Control](#6-security-authentication--role-based-access-control)
7. [Installation, Configuration & Local Development Guide](#7-installation-configuration--local-development-guide)
8. [Production Deployment & DevOps Guide](#8-production-deployment--devops-guide)
9. [Administrative Portal & Operational Workflows](#9-administrative-portal--operational-workflows)

---

## 1. Executive Summary & Project Overview

### 1.1 Mission & Purpose
**Elshaday Charity Organization** is a registered Ethiopian humanitarian foundation operating in **Wolyta Sodo, Ethiopia (Buge Sub-city)**. The organization focuses on:
- **Child Education Sponsorship**: Providing textbooks, uniforms, school kits, and tuition for orphaned and underprivileged children.
- **Community Nutrition & Food Security**: Organizing nutritional outreaches, community kitchens, and emergency food distributions.
- **Volunteer Mobilization & Community Empowerment**: Engaging university students, healthcare workers, educators, and community champions in local volunteer initiatives.
- **Transparent Philanthropy**: Providing clear, verifiable donation channels through Commercial Bank of Ethiopia (CBE) and Telebirr.

### 1.2 Core System Deliverables
- **Public Portal (`index.html`)**: High-performance, responsive single-page portal with bilingual language toggle (**English / አማርኛ**), real-time content synchronization, volunteer application submissions, donation modal, and left-aligned mobile slide-over drawer navigation.
- **Administrative Portal (`admin.html`)**: Protected operational dashboard for managing volunteers, content items (programs, events, news, announcements, gallery), contact inquiries, and real-time statistics.
- **Enterprise Backend API (NestJS + TypeORM + MySQL)**: Modular TypeScript backend providing JWT authentication, Swagger OpenAPI documentation (`/api/docs`), Multer media uploads, and database seeding.

---

## 2. Technology Stack & System Architecture

### 2.1 Technology Stack Matrix

| Tier | Technology | Purpose / Role |
| :--- | :--- | :--- |
| **Frontend Framework** | Vanilla HTML5 / ES6+ JavaScript | Zero-build-overhead, ultra-fast load time, native DOM manipulation |
| **Styling & CSS** | Custom CSS3 System (`style.css`) | Responsive CSS Grid, Flexbox, glassmorphism, fluid typography (`clamp()`), and smooth mobile drawer animations |
| **Typography** | Plus Jakarta Sans & Noto Sans Ethiopic | Clean Latin typography combined with native Amharic Fidel script support |
| **Backend Framework**| NestJS 10.x (TypeScript) | Scalable modular MVC architecture, dependency injection, and decorators |
| **Database ORM** | TypeORM 0.3.x | Object-Relational Mapping for MySQL with strong typing and lifecycle hooks |
| **Database Engine** | MySQL 8.0 / MariaDB 10.x | Relational storage with UTF8MB4 charset, indexing, and transactional integrity |
| **Authentication** | Passport.js & JWT (`@nestjs/jwt`) | Bearer token authentication with bcrypt password hashing (10 salt rounds) |
| **API Documentation**| Swagger OpenAPI (`@nestjs/swagger`)| Interactive documentation and testing console hosted at `/api/docs` |
| **File Management** | Multer (`@nestjs/platform-express`)| Multipart file handling for profile photos, ID documents, and media items |

### 2.2 System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT CLIENTS                                    |
|                                                                                   |
|   +------------------------------------+    +---------------------------------+   |
|   |  Public Portal (index.html)        |    |  Admin Dashboard (admin.html)   |   |
|   |  - Mobile Left Drawer Menu         |    |  - Volunteer Application Review |   |
|   |  - Volunteer Application Form      |    |  - CMS Program/Event Publishing |   |
|   |  - Bilingual Engine (EN / AM)      |    |  - Contact Message Center       |   |
|   |  - Real-time API Content Loader    |    |  - Real-time Metrics & Charts   |   |
|   +-----------------+------------------+    +----------------+----------------+   |
+---------------------|----------------------------------------|--------------------+
                      | HTTP / HTTPS (JSON REST API)           | Bearer JWT
                      v                                        v
+-----------------------------------------------------------------------------------+
|                         NESTJS BACKEND APPLICATION (Port 3000)                    |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Global Middleware: CORS, ValidationPipe, TransformInterceptor, Exception   |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  +-------------------+  +-------------------+  +-------------------+              |
|  | Auth Module       |  | Volunteers Module |  | Content Module    |              |
|  | - JWT Strategy    |  | - Public Register |  | - Public CMS Endpoints           |
|  | - Roles Guard     |  | - Status Lifecycle|  | - Dynamic Site Settings          |
|  +-------------------+  +-------------------+  +-------------------+              |
|  +-------------------+  +-------------------+  +-------------------+              |
|  | Messages Module   |  | Statistics Module |  | Upload Module     |              |
|  | - Public Inquiries|  | - Aggregated KPI  |  | - Multer Disk Storage            |
|  | - Admin Archiving |  | - Demographics    |  | - Static Serving (/uploads)     |
|  +-------------------+  +-------------------+  +-------------------+              |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | TypeORM Data Layer & Database Seeder                                         |  |
|  +-----------------------------------------------------------------------------+  |
+--------------------------------------|--------------------------------------------+
                                       | TCP / Connection Pool (Port 3306)
                                       v
+-----------------------------------------------------------------------------------+
|                           MYSQL 8.0 / MARIADB DATABASE                            |
|                                                                                   |
|   [admins]         [volunteers]       [content_items]     [site_settings]         |
|   [contact_messages]                  [Database Engine: InnoDB, Charset: utf8mb4] |
+-----------------------------------------------------------------------------------+
```

---

## 3. Database Architecture & Schema Design

The application utilizes a normalized schema with 5 primary tables inside the `elshaday_charity_db` database.

### 3.1 Entity Relationship Details

#### 1. `admins` (System Administrators)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | UUID unique identifier |
| `name` | `VARCHAR(100)` | `NOT NULL` | Admin display name |
| `email` | `VARCHAR(150)` | `NOT NULL, UNIQUE` | Login email address |
| `password` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hashed password |
| `role` | `ENUM` | `SUPER_ADMIN, ADMIN, MODERATOR` | Authorization level |
| `isActive` | `TINYINT(1)` | `DEFAULT 1` | Account active flag |
| `lastLoginAt` | `DATETIME` | `NULLABLE` | Last authenticated timestamp |
| `createdAt` | `DATETIME(6)` | `DEFAULT CURRENT_TIMESTAMP(6)` | Creation date |
| `updatedAt` | `DATETIME(6)` | `ON UPDATE CURRENT_TIMESTAMP(6)`| Last update date |

#### 2. `volunteers` (Volunteer Applications & Members)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT`| Numerical record ID |
| `fullName` | `VARCHAR(150)` | `NOT NULL` | Full legal name |
| `email` | `VARCHAR(150)` | `NOT NULL, UNIQUE` | Email address |
| `phone` | `VARCHAR(50)` | `NOT NULL` | Primary phone (e.g. `+251934287380`) |
| `gender` | `VARCHAR(20)` | `NULLABLE` | Gender identity |
| `dateOfBirth`| `DATE` | `NULLABLE` | Birth date |
| `address` | `VARCHAR(255)` | `NULLABLE` | Sub-city / Woreda / Street |
| `city` | `VARCHAR(100)` | `NULLABLE` | City (e.g. `Wolyta Sodo`) |
| `occupation` | `VARCHAR(100)` | `NULLABLE` | Professional occupation |
| `skills` | `TEXT` | `NULLABLE` | Comma-separated skills |
| `areasOfInterest`| `TEXT` | `NULLABLE` | Programs of interest |
| `availability`| `VARCHAR(100)`| `NULLABLE` | Availability schedule |
| `motivation` | `TEXT` | `NULLABLE` | Personal statement |
| `profilePhotoUrl`| `VARCHAR(255)`| `NULLABLE` | Photo path in `/uploads` |
| `idDocumentUrl` | `VARCHAR(255)`| `NULLABLE` | ID card path in `/uploads` |
| `cvUrl` | `VARCHAR(255)`| `NULLABLE` | Resume path in `/uploads` |
| `status` | `ENUM` | `PENDING, APPROVED, REJECTED, ACTIVE, INACTIVE` | Application status |
| `adminNotes` | `TEXT` | `NULLABLE` | Internal administrative remarks |
| `approvedAt` | `DATETIME` | `NULLABLE` | Approval timestamp |
| `approvedByAdminName`| `VARCHAR(100)`| `NULLABLE` | Reviewing admin |

#### 3. `content_items` (CMS Articles, Programs, Events, Gallery)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT`| Unique item ID |
| `type` | `ENUM` | `ABOUT, PROGRAM, EVENT, NEWS, ANNOUNCEMENT, GALLERY` | Content classification |
| `title` | `VARCHAR(255)` | `NOT NULL` | English headline |
| `titleAm` | `VARCHAR(255)` | `NULLABLE` | Amharic headline (አርዕስት) |
| `subtitle` | `VARCHAR(255)` | `NULLABLE` | Brief summary |
| `content` | `LONGTEXT` | `NULLABLE` | Detailed English body |
| `contentAm` | `LONGTEXT` | `NULLABLE` | Detailed Amharic body |
| `category` | `VARCHAR(100)` | `NULLABLE` | Category tag |
| `mediaCategory`| `ENUM` | `IMAGE, VIDEO, AUDIO, DOCUMENT` | Media type |
| `mediaUrl` | `VARCHAR(500)` | `NULLABLE` | URL or relative asset path |
| `targetAmount` | `DECIMAL(12,2)`| `DEFAULT 0.00` | Fundraising goal in ETB |
| `currentAmount`| `DECIMAL(12,2)`| `DEFAULT 0.00` | Current raised funds in ETB |
| `eventDate` | `DATETIME` | `NULLABLE` | Event schedule |
| `location` | `VARCHAR(255)` | `NULLABLE` | Physical venue |
| `isPublished` | `TINYINT(1)` | `DEFAULT 1` | Visibility toggle |
| `isFeatured` | `TINYINT(1)` | `DEFAULT 0` | Featured highlight toggle |
| `displayOrder` | `INT` | `DEFAULT 0` | Sorting priority |

#### 4. `site_settings` (Dynamic System Configuration)
| Key | Default Seeded Value | Group | Description |
| :--- | :--- | :--- | :--- |
| `org_name` | `Elshaday Charity Organization` | `branding` | Organization Name (EN) |
| `org_name_am` | `ኤልሻዳይ የበጎ አድራጎት ድርጅት` | `branding` | Organization Name (AM) |
| `org_address` | `Wolyta Sodo, Ethiopia (Buge Sub-city)` | `contact` | Physical Headquarters |
| `org_phone` | `+251 934 287 380` | `contact` | Primary Contact Number |
| `org_email` | `contact@elshaday.org` | `contact` | Primary Contact Email |
| `bank_cbe_account` | `1000722573138 (Izra, Bedilu and Asteway - CBE)`| `donation`| Commercial Bank of Ethiopia Account |
| `bank_telebirr` | `+251 934 287 380 (Telebirr)` | `donation` | Telebirr Fast Pay Number |

#### 5. `contact_messages` (Public Inquiries)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT`| Inquiry ID |
| `name` | `VARCHAR(150)` | `NOT NULL` | Sender full name |
| `email` | `VARCHAR(150)` | `NOT NULL` | Sender email |
| `phone` | `VARCHAR(50)` | `NULLABLE` | Sender phone |
| `subject` | `VARCHAR(255)` | `NOT NULL` | Message subject |
| `message` | `LONGTEXT` | `NOT NULL` | Message body |
| `status` | `ENUM` | `UNREAD, READ, REPLIED, ARCHIVED` | Processing state |
| `adminNotes` | `TEXT` | `NULLABLE` | Internal reply notes |

---

## 4. Backend RESTful API Specification

### 4.1 Authentication Endpoints
- `POST /api/auth/login`: Authenticates an administrator and issues a JWT token.
- `GET /api/auth/me`: Returns the authenticated administrator profile (`Bearer Token` required).
- `POST /api/auth/change-password`: Updates administrator password.

### 4.2 Volunteer Endpoints
- `POST /api/volunteers/register`: **[Public]** Submits a new volunteer application with optional file uploads.
- `GET /api/volunteers`: **[Protected]** Retrieves paginated volunteers with filters for `status`, `city`, `skills`, and `search`.
- `GET /api/volunteers/statistics`: **[Protected]** Returns total volunteer counts, status breakdown, and gender distribution.
- `GET /api/volunteers/:id`: **[Protected]** Retrieves full volunteer profile and documents.
- `PATCH /api/volunteers/:id/status`: **[Protected]** Updates volunteer status (`APPROVED`, `REJECTED`, `ACTIVE`, `INACTIVE`) and records reviewer notes.
- `DELETE /api/volunteers/:id`: **[Super Admin]** Deletes a volunteer record.

### 4.3 Content CMS Endpoints
- `GET /api/content/public/about`: **[Public]** Retrieves published "About Us" content.
- `GET /api/content/public/programs`: **[Public]** Retrieves published charity programs and funding progress.
- `GET /api/content/public/events`: **[Public]** Retrieves upcoming events.
- `GET /api/content/public/news`: **[Public]** Retrieves news articles.
- `GET /api/content/public/gallery`: **[Public]** Retrieves media gallery items.
- `GET /api/content/public/settings`: **[Public]** Retrieves organization contact, branding, and donation settings.
- `POST /api/content/admin/item`: **[Protected]** Creates a new content item.
- `PUT /api/content/admin/item/:id`: **[Protected]** Updates an existing content item.
- `PATCH /api/content/admin/item/:id/toggle-publish`: **[Protected]** Toggles published status.
- `DELETE /api/content/admin/item/:id`: **[Protected]** Deletes a content item.

### 4.4 Inquiries & Messages Endpoints
- `POST /api/messages`: **[Public]** Submits a contact inquiry.
- `GET /api/messages`: **[Protected]** Retrieves inquiry list with `status` filter.
- `PATCH /api/messages/:id/status`: **[Protected]** Updates inquiry state (`READ`, `REPLIED`, `ARCHIVED`).
- `DELETE /api/messages/:id`: **[Protected]** Deletes an inquiry message.

### 4.5 Statistics & Analytics Endpoints
- `GET /api/statistics/dashboard`: **[Protected]** Aggregated system metrics:
  - Total registered volunteers & pending approvals
  - Active humanitarian programs & total funds raised
  - Unread contact inquiries
  - Total gallery and media assets

---

## 5. Frontend Design System & Mobile UX Architecture

### 5.1 Color Palette & Theme Tokens

```css
:root {
  --bg-cream: #F5E6C8;           /* 🤍 Cream / Shiro: Warm Background */
  --brown: #8B5E3C;              /* 🟤 Warm Brown: Headings & Typography */
  --brown-dark: #664126;         /* 🟤 Dark Brown: Strong Accents */
  --green-action: #2E7D32;       /* 🟢 Action Green: Charity, Donate, Submit */
  --green-hover: #236327;        /* 🟢 Darker Green: Hover States */
  --gold: #D4A72C;               /* 🟡 Gold: Highlights & Badges */
  --dark-text: #222222;          /* ⚫ Dark Text: High Readability */
  --card-border: rgba(139, 94, 60, 0.22);
}
```

### 5.2 Left-Aligned Mobile Navigation Drawer
- On viewports `<= 960px`, the desktop navigation bar transforms into a mobile header:
  - **Left Side**: Hamburger toggle button (`#mobileMenuBtn`) positioned adjacent to the brand logo.
  - **Right Side**: Language toggle (`🇪🇹 አማርኛ` / `🌐 English`) and compact Donate button.
- **Drawer Motion**: Tapping the hamburger button triggers `.mobile-drawer.active`, sliding out from `left: 0` with a smooth cubic bezier transition (`transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1)`).
- **Backdrop**: An overlay with `backdrop-filter: blur(8px)` blurs the page background and closes the drawer when clicked.
- **Auto-Close**: Selecting any page link navigates smoothly to that section and closes the drawer automatically.

---

## 6. Security, Authentication & Role-Based Access Control

1. **Password Security**: Passwords are never stored in plaintext. They are salted and hashed using `bcryptjs` with 10 salt rounds.
2. **Stateless JWT Authorization**: API calls include `Authorization: Bearer <accessToken>`. Tokens are verified using `@nestjs/jwt` and `passport-jwt`.
3. **Role-Based Guards (`@Roles()`)**:
   - `SUPER_ADMIN`: Full privileges including admin user creation, database wipes, and record deletion.
   - `ADMIN`: Volunteer review, CMS publishing, and inquiry handling.
   - `MODERATOR`: Read-only access and status annotations.
4. **Input Sanitization & Validation**:
   - All payloads are strictly validated using `class-validator` and `class-transformer` inside a global `ValidationPipe` with `whitelist: true`.
5. **CORS Security**: Cross-Origin Resource Sharing is strictly configured to permit requests from verified domain origins.

---

## 7. Installation, Configuration & Local Development Guide

### 7.1 Prerequisites
- **Node.js**: v18.x or v20.x+
- **MySQL Server** (or XAMPP / MariaDB 10.4+): Running on port `3306`

### 7.2 Step-by-Step Setup

1. **Clone the Repository**:
   ```powershell
   git clone https://github.com/Kehindos/elshaday-charity-asso.git
   cd elshaday-charity-asso
   ```

2. **Configure Environment Variables**:
   Create or verify `backend/.env`:
   ```ini
   PORT=3000
   NODE_ENV=development

   # Database Settings
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=
   DB_DATABASE=elshaday_charity_db
   DB_SYNCHRONIZE=false
   DB_LOGGING=false

   # JWT Auth
   JWT_SECRET=elshaday_super_secure_jwt_secret_key_2026!
   JWT_EXPIRES_IN=7d

   # Default Super Admin
   DEFAULT_ADMIN_EMAIL=admin@example.com
   DEFAULT_ADMIN_PASSWORD=12345678
   DEFAULT_ADMIN_NAME=Super Admin
   ```

3. **Install Backend Dependencies**:
   ```powershell
   cd backend
   npm install
   ```

4. **Initialize MySQL Database**:
   Execute the schema initialization script:
   ```powershell
   mysql -u root -p < schema.sql
   ```
   *(Or run the automated seeder on server startup)*

5. **Start Development Server**:
   ```powershell
   npm run start:dev
   ```

6. **Access URLs**:
   - Public Website: [http://localhost:3000/](http://localhost:3000/)
   - Admin Portal: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
   - Interactive Swagger API Documentation: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
   - Test Portal: [http://localhost:3000/test-portal.html](http://localhost:3000/test-portal.html)

---

## 8. Production Deployment & DevOps Guide

### 8.1 Production Build
```powershell
cd backend
npm run build
```
The compiled output will be generated inside the `backend/dist/` directory.

### 8.2 Starting in Production Mode with PM2
```powershell
npm install -g pm2
pm2 start dist/main.js --name "elshaday-backend"
pm2 save
pm2 startup
```

### 8.3 Nginx Reverse Proxy Configuration
```nginx
server {
    listen 80;
    server_name elshaday.org www.elshaday.org;

    # Static uploads caching
    location /uploads/ {
        alias /var/www/elshaday/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # API and dynamic routes
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 9. Administrative Portal & Operational Workflows

### 9.1 Default Credentials
- **URL**: `http://localhost:3000/admin.html`
- **Email**: `admin@example.com`
- **Password**: `12345678`

### 9.2 Daily Operational Workflows
1. **Reviewing Volunteer Registrations**:
   - Navigate to the **Volunteers** tab.
   - Filter by status `PENDING` to inspect new applicants.
   - Click on an applicant to view submitted qualifications, photo, and CV.
   - Approve application to automatically move the volunteer into the active roster.
2. **Publishing New Charity Programs**:
   - Navigate to the **Content CMS** tab -> **Programs**.
   - Fill in Title (English & Amharic), funding target in ETB, category, and banner photo.
   - Click **Publish Program** to make it instantly visible on the public home page with an interactive donation progress bar.
3. **Responding to Contact Inquiries**:
   - Check the **Inquiries** tab for new community messages.
   - Mark inquiries as `READ` or `REPLIED` and record resolution notes for administrative auditing.
