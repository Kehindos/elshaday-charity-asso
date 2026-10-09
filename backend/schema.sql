-- ==========================================================
-- MySQL 8.0 Database Initialization Script for Charity Backend
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `elshaday_charity_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `elshaday_charity_db`;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('SUPER_ADMIN', 'ADMIN', 'MODERATOR') NOT NULL DEFAULT 'ADMIN',
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `lastLoginAt` DATETIME NULL,
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Volunteers Table
CREATE TABLE IF NOT EXISTS `volunteers` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `fullName` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(50) NOT NULL,
  `gender` VARCHAR(20) NULL,
  `dateOfBirth` DATE NULL,
  `address` VARCHAR(255) NULL,
  `city` VARCHAR(100) NULL,
  `occupation` VARCHAR(100) NULL,
  `skills` TEXT NULL,
  `areasOfInterest` TEXT NULL,
  `availability` VARCHAR(100) NULL,
  `motivation` TEXT NULL,
  `previousExperience` TEXT NULL,
  `profilePhotoUrl` VARCHAR(255) NULL,
  `idDocumentUrl` VARCHAR(255) NULL,
  `cvUrl` VARCHAR(255) NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING',
  `adminNotes` TEXT NULL,
  `approvedAt` DATETIME NULL,
  `approvedByAdminName` VARCHAR(100) NULL,
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `idx_volunteers_email` (`email`),
  INDEX `idx_volunteers_phone` (`phone`),
  INDEX `idx_volunteers_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Content Items (About, Programs, Events, News, Announcements, Gallery)
CREATE TABLE IF NOT EXISTS `content_items` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `type` ENUM('ABOUT', 'PROGRAM', 'EVENT', 'NEWS', 'ANNOUNCEMENT', 'GALLERY') NOT NULL DEFAULT 'NEWS',
  `title` VARCHAR(255) NOT NULL,
  `titleAm` VARCHAR(255) NULL,
  `subtitle` VARCHAR(255) NULL,
  `content` LONGTEXT NULL,
  `contentAm` LONGTEXT NULL,
  `category` VARCHAR(100) NULL,
  `mediaCategory` ENUM('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT') NOT NULL DEFAULT 'IMAGE',
  `mediaUrl` VARCHAR(500) NULL,
  `thumbnailUrl` VARCHAR(500) NULL,
  `targetAmount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `currentAmount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `eventDate` DATETIME NULL,
  `location` VARCHAR(255) NULL,
  `isPublished` TINYINT(1) NOT NULL DEFAULT 1,
  `isFeatured` TINYINT(1) NOT NULL DEFAULT 0,
  `displayOrder` INT NOT NULL DEFAULT 0,
  `tags` TEXT NULL,
  `metadata` JSON NULL,
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `idx_content_type` (`type`),
  INDEX `idx_content_published` (`isPublished`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Site Settings Table
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` TEXT NOT NULL,
  `group` VARCHAR(50) NOT NULL DEFAULT 'general',
  `description` VARCHAR(255) NULL,
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `idx_settings_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Contact Messages Table
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `fullName` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('UNREAD', 'READ', 'REPLIED', 'ARCHIVED') NOT NULL DEFAULT 'UNREAD',
  `adminNote` TEXT NULL,
  `repliedAt` DATETIME NULL,
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `idx_messages_email` (`email`),
  INDEX `idx_messages_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED INITIAL DATA
-- ==========================================================

-- 1. Default Super Admin (admin@charity.org / Admin123!)
INSERT IGNORE INTO `admins` (`id`, `name`, `email`, `password`, `role`, `isActive`) VALUES
('e84b85c1-23f4-4e1b-928d-194172f3e001', 'Super Administrator', 'admin@charity.org', '$2a$10$YA1tafk8dZlZyEwjQCPKouxV3MVsVMOz65amH24NO3eK0xRsXyvly', 'SUPER_ADMIN', 1);

-- 2. Default Organization Settings
INSERT IGNORE INTO `site_settings` (`key`, `value`, `group`, `description`) VALUES
('org_name', 'Elshaday Charity Organization', 'branding', 'Organization Name (EN)'),
('org_name_am', 'ኤልሻዳይ የበጎ አድራጎት ድርጅት', 'branding', 'Organization Name (AM)'),
('org_tagline', 'Empowering Communities, Transforming Lives', 'branding', 'Tagline'),
('org_email', 'contact@elshaday.org', 'contact', 'Primary contact email'),
('org_phone', '+251 934 287 380', 'contact', 'Primary phone number'),
('org_phone_secondary', '+251 922 345 678', 'contact', 'Secondary phone number'),
('org_address', 'Wolyta Sodo, Ethiopia (Buge Sub-city)', 'contact', 'Physical office address'),
('org_working_hours', 'Monday - Friday: 8:30 AM - 5:30 PM (EAT)', 'contact', 'Office hours'),
('bank_cbe_account', '1000123456789 (Commercial Bank of Ethiopia)', 'donation', 'CBE Donation Account'),
('bank_telebirr', '+251 934 287 380 (Telebirr)', 'donation', 'Telebirr Account');

-- 3. Initial Programs & Content
INSERT IGNORE INTO `content_items` (`id`, `type`, `title`, `titleAm`, `subtitle`, `content`, `contentAm`, `category`, `mediaCategory`, `mediaUrl`, `targetAmount`, `currentAmount`, `isPublished`, `isFeatured`, `displayOrder`) VALUES
(1, 'ABOUT', 'Who We Are', 'ስለ እኛ', 'Dedicated to helping vulnerable families, orphans, and youths', 'Elshaday Charity Organization is a non-profit humanitarian foundation operating in Ethiopia. Founded with the mission to alleviate poverty, sponsor child education, and provide emergency relief.', 'ኤልሻዳይ የበጎ አድራጎት ድርጅት በኢትዮጵያ ውስጥ የተቸገሩ ወገኖችን፣ ወላጅ አልባ ህፃናትን እና ወጣቶችን ለመርዳት የተቋቋመ ድርጅት ነው።', 'Mission & Vision', 'IMAGE', '/uploads/elshaday.jpg', 0, 0, 1, 0, 1),
(2, 'PROGRAM', 'Child Education & Sponsorship', 'የህፃናት ትምህርት እና ስፖንሰርሺፕ', 'Covering school fees, uniforms, and books for underprivileged students', 'Our education initiative supports over 300 students each academic year, ensuring no child is left behind due to poverty.', 'የትምህርት ድጋፍ ፕሮግራማችን በየአመቱ ከ300 በላይ ለሆኑ ተማሪዎች የትምህርት ቤት ወጪዎችን፣ ደንብ ልብሶችን እና መጻሕፍትን ያቀርባል።', 'Education', 'IMAGE', '/uploads/els1.jpg', 500000.00, 320000.00, 1, 1, 1),
(3, 'PROGRAM', 'Community Food Bank & Nutrition', 'የማህበረሰብ ምግብ ድጋፍ ፕሮግራም', 'Providing monthly food staples to elderly and single-parent households', 'Providing essential food parcels with teff, wheat flour, edible oil, and pulses to over 150 families monthly.', 'በየወሩ ለ150 ለሚሆኑ አቅመ ደካማ አረጋውያን እና እናቶች የምግብ አቅርቦት ድጋፍ ያደርጋል።', 'Humanitarian Aid', 'IMAGE', '/uploads/els2.jpg', 350000.00, 210000.00, 1, 1, 2),
(4, 'EVENT', 'Annual Youth Charity Run & Volunteer Meetup', 'አመታዊ የበጎ ፈቃደኞች የሩጫ እና የውይይት መድረክ', 'Join us for a 5km charity run in Addis Ababa to raise awareness and funds', 'Bring your running shoes and enthusiasm! All proceeds will go directly to purchasing back-to-school kits for orphans.', 'በአዲስ አበባ ከተማ የሚካሄድ የ5 ኪሎ ሜትር የበጎ አድራጎት ሩጫ። የተገኘው ገቢ ሙሉ በሙሉ ለህፃናት የትምህርት ቁሳቁስ መግዣ ይውላል።', 'Fundraiser', 'IMAGE', '/uploads/austin-kehmeier-lyiKExA4zQA-unsplash.jpg', 0, 0, 1, 1, 1),
(5, 'NEWS', 'Over 200 Students Received School Kits for the New Academic Year', 'ለ200 ተማሪዎች የትምህርት መርጃ ቁሳቁስ ተሰራጨ', 'Community solidarity makes quality education accessible to every child', 'Thanks to our generous donors and dedicated volunteers, distribution took place successfully this weekend.', 'በበጎ አድራጊዎች እና በበጎ ፈቃደኞች ትብብር የተዘጋጁ የትምህርት ቁሳቁሶች ለተማሪዎች ተበርክተዋል።', 'Community News', 'IMAGE', '/uploads/20250828_151315.jpg', 0, 0, 1, 1, 1);

-- 4. Initial Sample Volunteers
INSERT IGNORE INTO `volunteers` (`id`, `fullName`, `email`, `phone`, `gender`, `city`, `occupation`, `skills`, `areasOfInterest`, `availability`, `motivation`, `status`, `approvedByAdminName`) VALUES
(1, 'Almaz Tadesse', 'almaz.tadesse@example.com', '+251911122233', 'Female', 'Addis Ababa', 'Nurse', 'First Aid,Patient Care,Health Education', 'Healthcare,Elderly Care', 'Weekends', 'I love caring for vulnerable patients and want to contribute my medical skills.', 'ACTIVE', 'Super Administrator'),
(2, 'Yonas Bekele', 'yonas.bekele@example.com', '+251922334455', 'Male', 'Addis Ababa', 'Math Teacher', 'Teaching,Tutoring,Public Speaking', 'Child Education,Youth Mentorship', 'Saturday Mornings & Sunday Afternoons', 'Passionate about helping children succeed in STEM subjects.', 'APPROVED', 'Super Administrator'),
(3, 'Selamawit Girma', 'selamawit.g@example.com', '+251933445566', 'Female', 'Hawassa', 'IT Student', 'Graphic Design,Social Media,Photography', 'Media & Communications', 'Flexible', 'Want to help manage charity social media and photograph events.', 'PENDING', NULL);

-- 5. Initial Sample Messages
INSERT IGNORE INTO `contact_messages` (`id`, `fullName`, `email`, `phone`, `subject`, `message`, `status`) VALUES
(1, 'Solomon Tesfaye', 'solomon.tesfaye@gmail.com', '+251911887766', 'Donation of 50 school bags and stationery kits', 'Hello, our company would like to donate 50 school bags with stationery supplies for your education program.', 'UNREAD'),
(2, 'Bethlehem Desta', 'bethlehem.d@yahoo.com', '+251922776655', 'Volunteer group registration inquiry', 'We are a youth group of 15 university students from Addis Ababa University who wish to volunteer together.', 'READ');
