-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.43 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table apeck.events
CREATE TABLE IF NOT EXISTS `events` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `category` varchar(120) DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `cover_media_id` char(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `events_slug_unique` (`slug`),
  KEY `events_cover_media_id_foreign` (`cover_media_id`),
  CONSTRAINT `events_cover_media_id_foreign` FOREIGN KEY (`cover_media_id`) REFERENCES `media_assets` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.events: ~0 rows (approximately)
INSERT INTO `events` (`id`, `title`, `slug`, `description`, `start_date`, `end_date`, `location`, `category`, `status`, `cover_media_id`, `created_at`, `updated_at`) VALUES
	('aaf9650a-4ab9-4124-ab07-affff800ccfc', 'Pastoral Care Certification Program Begins', 'pastoral-care-certification-program-begins', 'Comprehensive 6-month certification program in pastoral care and biblical counseling. Limited spots available.', '2025-11-26', '2025-11-27', 'Apeck Center', 'Workshop', 'published', NULL, '2025-11-16 11:42:38', '2025-11-16 11:42:38'),
	('eeb2d1d8-1616-47ef-9fad-393b2e9b4372', 'Annual Leadership Conference', 'annual-leadership-conference', 'Three days of powerful teaching, workshops, and networking. Featured speakers include renowned ministry leaders from across Africa.', '2025-11-19', '2025-11-20', 'Nairobi', 'Conference', 'published', NULL, '2025-11-16 11:22:26', '2025-11-16 11:22:26');

-- Dumping structure for table apeck.knex_migrations
CREATE TABLE IF NOT EXISTS `knex_migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.knex_migrations: ~1 rows (approximately)
INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
	(1, '202411140001_initial_schema.ts', 1, '2025-11-14 09:21:14'),
	(2, '202411150001_add_news_home_fields.ts', 2, '2025-11-15 12:38:53');

-- Dumping structure for table apeck.knex_migrations_lock
CREATE TABLE IF NOT EXISTS `knex_migrations_lock` (
  `index` int unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.knex_migrations_lock: ~1 rows (approximately)
INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
	(1, 0);

-- Dumping structure for table apeck.media_assets
CREATE TABLE IF NOT EXISTS `media_assets` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `file_name` varchar(255) NOT NULL,
  `url` varchar(2048) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `mime_type` varchar(120) DEFAULT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `category` varchar(120) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `media_assets_created_by_foreign` (`created_by`),
  CONSTRAINT `media_assets_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.media_assets: ~11 rows (approximately)
INSERT INTO `media_assets` (`id`, `file_name`, `url`, `alt_text`, `mime_type`, `width`, `height`, `category`, `created_by`, `created_at`, `updated_at`) VALUES
	('28a76d34-1dcc-4907-aa4f-e7d5b92c5d0f', '1763202246845-536160193.jpg', '/uploads/1763202246845-536160193.jpg', NULL, 'image/jpeg', NULL, NULL, 'image', NULL, '2025-11-15 10:24:06', '2025-11-15 10:24:06'),
	('3c496621-b14a-480b-9f70-e013eb12c270', '1763202319697-731808371.jpg', '/uploads/1763202319697-731808371.jpg', NULL, 'image/jpeg', NULL, NULL, 'image', NULL, '2025-11-15 10:25:19', '2025-11-15 10:25:19'),
	('52fe4143-5f40-4ff1-a2cb-282ed0f4657c', '1763202264546-175728204.jpg', '/uploads/1763202264546-175728204.jpg', NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-16 11:42:38', '2025-11-16 11:42:38'),
	('53b6882d-2ee8-40ad-89b0-f6224b279ba2', '1763202239842-169679919.jpg', '/uploads/1763202239842-169679919.jpg', NULL, 'image/jpeg', NULL, NULL, 'image', NULL, '2025-11-15 10:23:59', '2025-11-15 10:23:59'),
	('58913649-1438-4b57-b4ea-3dfa14cfc7e8', '1763202273523-705231851.jpg', '/uploads/1763202273523-705231851.jpg', NULL, 'image/jpeg', NULL, NULL, 'image', NULL, '2025-11-15 10:24:33', '2025-11-15 10:24:33'),
	('9301489e-dae6-41bd-aa3e-484e6a038598', '1763202283245-83797638.png', '/uploads/1763202283245-83797638.png', NULL, 'image/png', NULL, NULL, 'image', NULL, '2025-11-15 10:24:43', '2025-11-15 10:24:43'),
	('b7a9ae0c-ab0f-4394-864f-895a1c227bcd', '1763202252148-141842368.jpg', '/uploads/1763202252148-141842368.jpg', NULL, 'image/jpeg', NULL, NULL, 'image', NULL, '2025-11-15 10:24:12', '2025-11-15 10:24:12'),
	('caff5955-ca0e-4a2f-9729-ffffa0c3c2f6', '1763202310989-644810615.jpg', '/uploads/1763202310989-644810615.jpg', NULL, 'image/jpeg', NULL, NULL, 'image', NULL, '2025-11-15 10:25:10', '2025-11-15 10:25:10'),
	('cdd5d62a-77bc-4cf1-898b-20885bbb05da', '1763202264546-175728204.jpg', '/uploads/1763202264546-175728204.jpg', NULL, 'image/jpeg', NULL, NULL, 'image', NULL, '2025-11-15 10:24:24', '2025-11-15 10:24:24'),
	('d79917b4-5d70-4e0f-8f80-889a3571ca9b', '1763202295242-450227197.png', '/uploads/1763202295242-450227197.png', NULL, 'image/png', NULL, NULL, 'image', NULL, '2025-11-15 10:24:55', '2025-11-15 10:24:55'),
	('de9cda9b-e892-4201-aa85-8b0d8a3244b3', '1763202303871-140188975.jpg', '/uploads/1763202303871-140188975.jpg', NULL, 'image/jpeg', NULL, NULL, 'image', NULL, '2025-11-15 10:25:03', '2025-11-15 10:25:03'),
	('f5fb152a-5e58-498f-85cc-0c1e61ca0a84', '1763202183390-249080577.jpg', '/uploads/1763202183390-249080577.jpg', NULL, 'image/jpeg', NULL, NULL, 'image', NULL, '2025-11-15 10:23:03', '2025-11-15 10:23:03');

-- Dumping structure for table apeck.membership_plans
CREATE TABLE IF NOT EXISTS `membership_plans` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `fee_amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'KES',
  `description` text,
  `benefits` json DEFAULT NULL,
  `requirements` json DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `membership_plans_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.membership_plans: ~0 rows (approximately)

-- Dumping structure for table apeck.news_posts
CREATE TABLE IF NOT EXISTS `news_posts` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text,
  `body` longtext NOT NULL,
  `status` enum('draft','scheduled','published') NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `hero_media_id` char(36) DEFAULT NULL,
  `author_id` char(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hero_image_url` varchar(2048) DEFAULT NULL,
  `show_on_home` tinyint(1) NOT NULL DEFAULT '0',
  `home_display_order` int NOT NULL DEFAULT '0',
  `reading_time` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `news_posts_slug_unique` (`slug`),
  KEY `news_posts_hero_media_id_foreign` (`hero_media_id`),
  KEY `news_posts_author_id_foreign` (`author_id`),
  CONSTRAINT `news_posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `news_posts_hero_media_id_foreign` FOREIGN KEY (`hero_media_id`) REFERENCES `media_assets` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.news_posts: ~0 rows (approximately)
INSERT INTO `news_posts` (`id`, `slug`, `title`, `excerpt`, `body`, `status`, `published_at`, `hero_media_id`, `author_id`, `created_at`, `updated_at`, `hero_image_url`, `show_on_home`, `home_display_order`, `reading_time`) VALUES
	('5b812ec6-c23b-11f0-ba4f-00155dcfbcb2', 'new-pastoral-care-certification-program', 'New Pastoral Care Certification Program', 'We are excited to announce the launch of our comprehensive pastoral care and counseling certification program, starting', '\nAPECK is excited to announce the launch of our comprehensive Pastoral Care and Biblical Counseling Certification Program, scheduled to begin in January 2025. This intensive 6-month program is designed to equip clergy with essential skills in pastoral care, crisis counseling, and biblical counseling.\n\nThe program will be delivered through a combination of in-person workshops, online modules, and supervised practical experience. Participants will learn from experienced counselors and pastoral care specialists, gaining both theoretical knowledge and hands-on skills.\n\nKey components of the certification program include:\n\nThe program is limited to 30 participants per cohort to ensure personalized attention and quality training. Applications are now open, with priority given to APECK members. Successful completion of the program will result in a recognized certification that can enhance ministry effectiveness and credibility.\n\nThis initiative represents APECK\'s commitment to providing practical, applicable training that addresses real-world ministry challenges. We believe that equipped leaders can better serve their congregations and communities.\n\n\n', 'published', '2025-11-16 10:26:38', NULL, 'dab741fd-4162-456b-aa86-e510311ef18e', '2025-11-15 15:54:24', '2025-11-15 15:54:24', '/uploads/1763202264546-175728204.jpg', 1, 0, '4');

-- Dumping structure for table apeck.pages
CREATE TABLE IF NOT EXISTS `pages` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text,
  `seo_metadata` json DEFAULT NULL,
  `featured_media_id` char(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pages_slug_unique` (`slug`),
  KEY `pages_featured_media_id_foreign` (`featured_media_id`),
  CONSTRAINT `pages_featured_media_id_foreign` FOREIGN KEY (`featured_media_id`) REFERENCES `media_assets` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.pages: ~6 rows (approximately)
INSERT INTO `pages` (`id`, `slug`, `title`, `excerpt`, `status`, `seo_title`, `seo_description`, `seo_metadata`, `featured_media_id`, `created_at`, `updated_at`) VALUES
	('07b6c494-c164-11f0-ba4f-00155dcfbcb2', 'wrwr', 'rwewr', '', 'draft', '', '', NULL, NULL, '2025-11-14 14:13:01', '2025-11-14 14:13:01'),
	('10c655ec-506e-4611-892b-48d4a34190cf', 'fgdg', 'tregf', '', 'draft', '', '', NULL, NULL, '2025-11-14 14:22:17', '2025-11-14 14:22:17'),
	('2cfde759-c162-11f0-ba4f-00155dcfbcb2', 'home', 'Home', '', 'published', '', '', NULL, NULL, '2025-11-14 13:59:45', '2025-11-14 13:59:45'),
	('3561e394-ae80-4182-b547-0c0ca6d53f37', 'contact', 'Contact', '', 'published', '', '', NULL, NULL, '2025-11-16 12:07:52', '2025-11-16 12:07:52'),
	('3d063cf3-d027-435e-91ff-2dc26608738b', 'membership', 'Membership', '', 'published', '', '', NULL, NULL, '2025-11-16 09:18:55', '2025-11-16 09:18:55'),
	('41504d8a-c971-4656-ae03-8a9938c5cf37', 'programs', 'Program', '', 'published', '', '', NULL, NULL, '2025-11-16 08:33:27', '2025-11-16 08:33:27'),
	('44e8d6de-a83c-4ef1-9765-9fa64d147b1c', 'news', 'News', '', 'published', '', '', NULL, NULL, '2025-11-16 10:26:00', '2025-11-16 10:26:00'),
	('5c7f3e21-c164-11f0-ba4f-00155dcfbcb2', 'dsfdf', 'resdsdf', '', 'draft', '', '', NULL, NULL, '2025-11-14 14:15:24', '2025-11-14 14:15:24'),
	('9edd600a-fa54-4a42-bf6f-fe971387ef20', 'gallery', 'Gallery', '', 'published', '', '', NULL, NULL, '2025-11-16 11:49:12', '2025-11-16 11:49:12'),
	('b28281af-a26f-406d-b3a5-66640463bb71', 'footer', 'Footer', '', 'published', '', '', NULL, NULL, '2025-11-16 12:42:17', '2025-11-16 12:42:17'),
	('b7a27664-8d73-4a64-b1ef-e33206fa017d', 'program', 'Program', '', 'published', '', '', NULL, NULL, '2025-11-15 17:29:46', '2025-11-15 17:29:46'),
	('c0757362-c162-11f0-ba4f-00155dcfbcb2', 'about', 'About', '', 'published', '', '', NULL, NULL, '2025-11-14 14:03:52', '2025-11-14 14:03:52'),
	('d630d0db-c163-11f0-ba4f-00155dcfbcb2', 'test2', 'test', '', 'published', '', '', NULL, NULL, '2025-11-14 14:11:38', '2025-11-14 14:11:38');

-- Dumping structure for table apeck.page_sections
CREATE TABLE IF NOT EXISTS `page_sections` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `page_id` char(36) NOT NULL,
  `key` varchar(150) NOT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `content` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_sections_page_id_key_unique` (`page_id`,`key`),
  CONSTRAINT `page_sections_page_id_foreign` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.page_sections: ~6 rows (approximately)
INSERT INTO `page_sections` (`id`, `page_id`, `key`, `display_order`, `status`, `content`, `created_at`, `updated_at`) VALUES
	('012a1dd8-f92e-4a6b-948a-8abe8511a3f3', '3d063cf3-d027-435e-91ff-2dc26608738b', 'membership_tiers', 0, 'published', '{"items": [{"name": "Individual Member", "bullets": [{"text": "Access to core training programs & webinars"}, {"text": "Quarterly ministry insights newsletter"}, {"text": "Digital resource library & templates "}, {"text": "Access to national clergy networking forum"}], "featured": "", "subtitle": "For clergy seeking personal support", "applyLabel": "Apply Now", "priceLabel": "KSh 1,050"}, {"name": "Corporate Membership", "bullets": [{"text": "Covers up to 5 designated clergy leaders "}, {"text": "Priority booking for onsite training & audits"}, {"text": "Custom leadership retreats & mentorship tracks"}, {"text": "Discounted exhibition & conference booths"}, {"text": "Voting rights & policy participation"}], "featured": "", "subtitle": "For churches & ministry organizations", "applyLabel": "Apply Now", "priceLabel": "KSh 10,000"}, {"name": "Housing Corporations", "bullets": [{"text": "Co-branding on APECK housing initiatives "}, {"text": "Direct access to clergy housing cooperative "}, {"text": "Pipeline of pre-qualified ministry clients "}, {"text": "Invitation to investment forums & expos "}, {"text": "Dedicated partnership & compliance support"}], "featured": "", "subtitle": "Strategic partners for clergy housing", "applyLabel": "Apply Now", "priceLabel": "KSh 5,050"}], "title": "Membership Categories", "badgeLabel": "MEMBERSHIP CATEGORIES", "description": "Choose the membership level that fits your ministry"}', '2025-11-16 09:43:21', '2025-11-16 09:43:21'),
	('09022a42-ac57-4e1f-a329-05ece6852b13', '2cfde759-c162-11f0-ba4f-00155dcfbcb2', 'cta', 0, 'published', '{"title": "Ready to Make an Impact?", "primaryCta": {"href": "/membership", "label": "Become a Member"}, "description": "Join a community of passionate clergy committed to transforming Kenya through the Gospel", "secondaryCta": {"href": "/contact", "label": "Get In Touch"}}', '2025-11-15 17:26:35', '2025-11-15 17:26:35'),
	('0c2e5d81-185b-4d6c-93f2-20f0f212ff4b', '2cfde759-c162-11f0-ba4f-00155dcfbcb2', 'hero_slides', 0, 'published', '{"slides": [{"image": "/uploads/1763202273523-705231851.jpg", "title": "Empowering the Clergy", "buttons": [{"href": "/membership", "icon": "arrow", "label": "Join Apeck", "style": "primary"}, {"href": "/programs", "icon": "heart", "label": "Learn More", "style": "secondary"}, {"href": "", "icon": "heart", "label": "Partner with Us", "style": "outlined"}, {"href": "", "icon": "play", "label": "Watch Video", "style": "secondary"}], "subtitle": "for Kingdom Impact", "description": "Uniting Pentecostal and Evangelical clergy across Kenya through training, leadership development, and spiritual empowerment", "imageMobile": "/uploads/1763202273523-705231851.jpg"}, {"image": "/uploads/1763202183390-249080577.jpg", "title": "Community Impact ", "subtitle": "Across Kenya", "description": "Reaching all 47 counties with transformative ministry initiatives and humanitarian outreach programs", "imageMobile": "/uploads/1763202183390-249080577.jpg"}]}', '2025-11-14 14:59:00', '2025-11-14 14:59:00'),
	('14e927cc-d074-47b3-a514-82825e090791', '3561e394-ae80-4182-b547-0c0ca6d53f37', 'contact_social', 0, 'published', '{"x": "", "title": "Connect With Us", "youtube": "", "facebook": "", "instagram": ""}', '2025-11-16 12:11:42', '2025-11-16 12:11:42'),
	('1d0fdef4-ad19-4ecb-9461-1a1bbf8ded6f', '3561e394-ae80-4182-b547-0c0ca6d53f37', 'contact_info', 0, 'published', '{"hours": "Monday - Friday: 8:00 AM - 5:00 PM\\nSaturday: 9:00 AM - 1:00 PM\\nSunday: Closed", "emails": [{"text": "ceo@apeck.co.ke"}, {"text": "info@apeck.co.ke"}], "phones": [{"text": "+254 708 401 728"}], "hoursTitle": "Office Hours", "officeTitle": "Office Address", "officeAddress": "Bella Rose Apartments\\nKileleshwa off Othaya Rd.\\n1st Floor, Rm. A02\\nP.O. Box 59092 - 00200"}', '2025-11-16 12:09:11', '2025-11-16 12:09:11'),
	('1d88e329-2ce8-4a70-9f89-3a684cd6a038', 'c0757362-c162-11f0-ba4f-00155dcfbcb2', 'about_leadership', 0, 'published', '{"title": "Our Leadership", "leaders": [{"name": "Bishop David Kimani", "role": "National Chairman", "image": "/uploads/1763202310989-644810615.jpg", "description": "Leading APECK with vision and passion for clergy empowerment"}, {"name": "Pastor James Mwangi", "role": "Training Director", "image": "/uploads/1763202319697-731808371.jpg", "description": "Overseeing all training and development initiatives"}, {"name": "Rev. Peter Omondi", "role": "General Secretary", "image": "/uploads/1763202303871-140188975.jpg", "description": "Coordinating programs and member services across Kenya"}], "badgeLabel": "LEARDERSHIP", "description": "Experienced leaders committed to serving the clergy community"}', '2025-11-15 18:09:40', '2025-11-15 18:09:40'),
	('269d0758-802f-445c-b7a1-4d912aeb0671', '3d063cf3-d027-435e-91ff-2dc26608738b', 'membership_benefits', 0, 'published', '{"items": [{"icon": "award", "color": "", "title": "Professional Development", "description": "Access to comprehensive training programs, workshops, and seminars for continuous growth"}, {"icon": "users", "color": "", "title": "Networking Opportunities", "description": "Connect with fellow clergy across Kenya and build meaningful ministry partnerships"}, {"icon": "heart", "color": "", "title": "Pastoral Care", "description": "Receive support, counseling, and mentorship from experienced ministry leaders"}, {"icon": "shield", "color": "", "title": "Certification", "description": "Official recognition and certification as a member of APECK"}, {"icon": "book", "color": "", "title": "Resource Library", "description": "Access to extensive library of books, materials, and digital resources"}, {"icon": "star", "color": "", "title": "Annual Conference", "description": "Exclusive access to our annual leadership conference and special events"}], "title": "Membership Benefits", "badgeLabel": "MEMBERSHIP BENEFITS", "description": "Why join APECK?"}', '2025-11-16 09:38:30', '2025-11-16 09:38:30'),
	('3b17e0c1-fbcb-4d5c-a49d-3e2a38d007cc', '3d063cf3-d027-435e-91ff-2dc26608738b', 'membership_requirements', 0, 'published', '{"items": [{"icon": "heart", "title": "Calling to Ministry", "description": "\\nClear evidence of a calling to full-time Christian ministry"}, {"icon": "book", "title": "Doctrinal Statement", "description": "\\nAgreement with APECK\'s statement of faith and core beliefs"}, {"icon": "award", "title": "Ministry Experience", "description": "\\nActive involvement in ministry (requirements vary by membership level)"}, {"icon": "users", "title": "References", "description": "\\nTwo pastoral references from recognized ministry leaders"}, {"icon": "shield", "title": "Application Fee", "description": "\\nOne-time non-refundable application fee of KSh 1,000"}], "title": "Membership Requirements", "badgeLabel": "MEMBERSHIP REQUIREMENTS", "description": "What you need to become a member"}', '2025-11-16 10:03:01', '2025-11-16 10:03:01'),
	('4126b859-bed9-46b4-acf6-50eaabc6f665', '41504d8a-c971-4656-ae03-8a9938c5cf37', 'programs_intro', 0, 'published', '{"title": "APECK\'s National Impact", "summary": "Since 2016, APECK has built a faith-led ecosystem that reforms lives, restores families, and strengthens local economies. Our programs merge pastoral care, professional training, and strategic partnerships to create lasting transformation.", "badgeLabel": "INTRODUCTION", "highlights": [{"title": "Holistic Rehabilitation", "description": "CBR combines pastoral counseling, peer mentorship, and socio-economic reintegration."}, {"title": "National Reach", "description": "By 2023, clergy were implementing CBR-inspired programs in nearly every county."}, {"title": "Strategic Partnerships", "description": "Formal collaboration with NACADA, government rehab centers, universities, and employers."}], "paragraphs": [{"text": "The Community-Based Rehabilitation (CBR) model launched in Kiambaa, Kiambu County, and quickly became a template for reform. Clergy-led mentorship helped former gang members, drug users, and parolees rebuild their lives, with many now serving in ministry or community leadership."}, {"text": "In August 2023, APECK signed an MOU with the National Authority for the Campaign Against Alcohol and Drug Abuse (NACADA). This partnership elevated our ability to train Recovery Coaches, scale peer-led counseling, and institutionalize aftercare across Kenya."}], "partnerNote": "APECK leverages the trust of the church to deliver rehabilitation, economic empowerment, and family cohesion initiatives that keep communities safe and resilient."}', '2025-11-16 08:35:32', '2025-11-16 08:35:32'),
	('41db2d68-6315-4346-ab22-66b35f7dc010', '41504d8a-c971-4656-ae03-8a9938c5cf37', 'programs_aftercare', 0, 'published', '{"title": "Critical Care & Aftercare Pathways", "pillars": [{"title": " Registration & Referral", "bullets": [{"text": "Pastors document each case and coordinate transportation."}, {"text": "Urgent cases are referred to government rehab centers such as Ihururu (Nyeri) and Miritini (Mombasa)."}], "summary": "Individuals in crisis are assisted to register with Social and Health Assistance (SHA) services."}, {"title": "Specialized Rehabilitation", "bullets": [{"text": "APECK chaplains maintain weekly contact for encouragement."}, {"text": "Families receive mediation support to prepare for reintegration."}], "summary": "Government and partner facilities provide medical, psychological, and spiritual care."}, {"title": "Aftercare & Economic Reintegration", "bullets": [{"text": "Talent & skills assessments, plus education return pathways."}, {"text": "Job placement through negotiated employer agreements."}, {"text": "Seed capital and mentorship for start-ups when formal jobs are limited."}], "summary": "Post-rehab plans focus on education, employment, and entrepreneurship."}], "description": "APECK ensures every beneficiary receives wraparound services—from emergency referrals to economic reintegration."}', '2025-11-16 08:44:47', '2025-11-16 08:44:47'),
	('41e255d8-130b-4a49-8800-3d76b6a6a206', '9edd600a-fa54-4a42-bf6f-fe971387ef20', 'gallery_impact', 0, 'published', '{"stats": [{"color": "", "label": "Events Documented", "value": "500+ "}, {"color": "", "label": "Photos Captured", "value": "10,000+ "}, {"color": "", "label": "Counties Covered", "value": "47 "}, {"color": "", "label": "Years of Memories", "value": "15 "}], "title": "Our Impact in Pictures", "badgeLabel": "OUR IMPACT", "description": "Documenting our journey of faith and service"}', '2025-11-16 11:57:31', '2025-11-16 11:57:31'),
	('444f7b51-f619-4a5b-a8c0-97abe32ffffd', '41504d8a-c971-4656-ae03-8a9938c5cf37', 'programs_features', 0, 'published', '{"items": [{"icon": "graduation", "color": "", "title": "Expert Instructors", "description": "Learn from experienced ministry leaders and theologians"}, {"icon": "book", "color": "", "title": "Practical Training", "description": "Hands-on experience and real-world ministry applications"}, {"icon": "award", "color": "", "title": "Certification", "description": "Receive recognized certificates upon program completion"}, {"icon": "users", "color": "", "title": "Community", "description": "Connect with fellow clergy and build lasting relationships"}], "title": "Program Features", "badgeLabel": "PROGRAM FEATURES", "description": "What makes our programs exceptional"}', '2025-11-16 08:58:32', '2025-11-16 08:58:32'),
	('46c768bd-d713-4077-a5aa-a6545de4cdef', 'b7a27664-8d73-4a64-b1ef-e33206fa017d', 'programs_hero', 0, 'published', '{"title": "Community Transformation Programs", "badgeLabel": "OUR PROGRAMS", "description": "APECK partners with churches, NACADA, and community leaders to deliver holistic rehabilitation, mediation, youth empowerment, and dignified housing solutions across Kenya.", "backgroundImage": "/uploads/1763202246845-536160193.jpg"}', '2025-11-16 08:19:17', '2025-11-16 08:19:17'),
	('4a181ea8-61da-464d-9ab5-e6b302aa0fa0', '2cfde759-c162-11f0-ba4f-00155dcfbcb2', 'testimonials', 0, 'published', '{"items": [{"name": "Pastor Eunice Wambui", "role": "Associate Pastor, Nakuru", "rating": "5", "content": "\\"The training programs are world-class. I\'ve grown tremendously in my leadership capacity and biblical understanding through APECK.\\"\\n"}, {"name": "Rev. Peter Njoroge", "role": " Senior Minister, Eldoret", "rating": "4", "content": "\\n\\"APECK creates an environment where clergy can thrive. The community support and continuous learning opportunities are exceptional.\\"\\n"}, {"name": "Pastor Jane Akinyi", "role": "Children\'s Ministry Leader", "rating": "5", "content": "\\n\\"Through APECK, I\'ve connected with like-minded ministers and gained skills that have revolutionized how I serve in ministry.\\"\\n\\n\\n"}, {"name": "Rev. Dr. James Mwangi", "role": "Senior Pastor, Nairobi", "rating": "5", "content": "\\n\\"APECK has transformed my ministry through comprehensive training programs that equipped me with practical leadership skills and theological depth.\\"\\n\\n\\n\\n"}, {"name": "Pastor Grace Wanjiku", "role": "Church Leader, Mombasa", "rating": "5", "content": "\\"The community and support network I found through APECK has been invaluable. The mentorship programs helped me navigate complex ministry challenges.\\"\\n\\n\\n"}, {"name": "Bishop David Otieno", "role": "Regional Coordinator", "rating": "4", "content": "\\"APECK\'s commitment to excellence in clergy development is unmatched. The training programs are relevant, practical, and spiritually enriching.\\"\\n\\n\\n"}, {"name": " Rev. Dr. Sarah Kariuki", "role": "Women\'s Ministry Director", "rating": "5", "content": "\\"Being part of APECK has opened doors I never imagined. The networking opportunities and training have elevated my ministry impact significantly.\\"\\n\\n\\n"}, {"name": "Bishop Samuel Kimani", "role": "Diocese Bishop, Central Kenya", "rating": "3", "content": "\\"APECK\'s holistic approach to clergy development addresses both spiritual and practical aspects of ministry. Highly recommend to all clergy.\\"\\n\\n\\n\\n"}, {"name": "Pastor Michael Ochieng", "role": "Youth Pastor, Kisumu", "rating": "4", "content": "\\"The resources and mentorship I received through APECK have been transformative. I now lead with more confidence and effectiveness.\\"\\n\\n\\n\\n"}], "title": "What Our Members Say", "badgeLabel": "TESTIMONIALS", "description": "Real stories from clergy transformed through APECK"}', '2025-11-15 12:07:18', '2025-11-15 12:07:18'),
	('50c6804b-bf25-4e04-8720-e5d14ae6f4da', 'c0757362-c162-11f0-ba4f-00155dcfbcb2', 'about_mission_vision', 0, 'published', '{"visionIcon": "eye", "missionIcon": "target", "visionTitle": "Our Vision", "missionTitle": "Our Mission", "visionDescription": "A Kenya where every Pentecostal and Evangelical clergy member is fully equipped, spiritually vibrant, and effectively leading transformative ministries that impact communities for Christ.", "missionDescription": "To empower, equip, and unite Pentecostal and Evangelical clergy across Kenya through comprehensive training, spiritual development, and collaborative ministry initiatives."}', '2025-11-15 18:03:31', '2025-11-15 18:03:31'),
	('5f1ea562-a7cc-4c27-8d16-55003330e768', 'b28281af-a26f-406d-b3a5-66640463bb71', 'footer_main', 0, 'published', '{"x": "", "logo": "/uploads/1763202295242-450227197.png", "about": "Empowering the Clergy for Kingdom Impact across Kenya 12", "email": "ceo@apeck.co.ke", "phone": "+254 708 401 728", "address": "Kileleshwa, Nairobi - Kenya", "youtube": "", "facebook": "", "copyright": "© 2025 APECK - Association of Pentecostal & Evangelical Clergy of Kenya. All rights reserved.", "instagram": "", "resources": [{"href": "#", "label": "Training Materials"}, {"href": "#", "label": "Publications"}, {"href": "/gallery", "label": "Gallery"}, {"href": "/contact", "label": "Contact"}], "quickLinks": [{"href": "/about", "label": "About Us"}, {"href": "/program", "label": "Programs"}, {"href": "/membership", "label": "Membership"}, {"href": "/news", "label": "News & Events"}]}', '2025-11-16 12:42:39', '2025-11-16 12:42:39'),
	('614ca219-d60c-4404-b171-d8f147070e32', 'c0757362-c162-11f0-ba4f-00155dcfbcb2', 'about_hero', 0, 'published', '{"title": "About APECK", "badgeLabel": "ABOUT US", "description": "Building a unified community of Pentecostal and Evangelical clergy dedicated to excellence in ministry and Kingdom impact", "backgroundImage": "/uploads/1763202273523-705231851.jpg"}', '2025-11-15 17:58:14', '2025-11-15 17:58:14'),
	('62c75456-ffe0-4ec0-874d-87d4264eeeb3', '9edd600a-fa54-4a42-bf6f-fe971387ef20', 'gallery_hero', 0, 'published', '{"title": "Gallery", "badgeLabel": "MEMORY LANE", "description": "Capturing moments of faith, fellowship, and transformation across our ministry", "backgroundImage": "/uploads/1763202264546-175728204.jpg"}', '2025-11-16 11:51:04', '2025-11-16 11:51:04'),
	('641426ba-375a-4e7d-8726-8794b70bfbf5', '41504d8a-c971-4656-ae03-8a9938c5cf37', 'programs_cta', 0, 'published', '{"title": "Ready to Grow in Your Ministry?", "primary": {"href": "/membership", "label": "Enroll Now"}, "secondary": {"href": "/contact", "label": "Contact Us"}, "badgeLabel": "GET STARTED", "description": "Enroll in one of our programs and take your ministry to the next level"}', '2025-11-16 09:01:31', '2025-11-16 09:01:31'),
	('676d8bc4-4f35-4f2b-8a9f-d10306fc75df', 'c0757362-c162-11f0-ba4f-00155dcfbcb2', 'about_values', 0, 'published', '{"items": [{"icon": "heart", "color": "", "title": "Spiritual Excellence", "description": "Pursuing the highest standards in spiritual life and ministry practice"}, {"icon": "award", "color": "", "title": "Integrity", "description": "Maintaining the highest ethical standards in all our dealings"}, {"icon": "target", "color": "", "title": " Unity", "description": "Fostering collaboration and partnership among clergy and ministries"}, {"icon": "eye", "color": "", "title": "Empowerment", "description": "Equipping clergy with tools and resources for effective ministry"}], "title": "Core Values", "badgeLabel": "OUR VALUES", "description": "The principles that guide everything we do"}', '2025-11-15 18:06:38', '2025-11-15 18:06:38'),
	('6ab7941c-e81b-4b26-a42b-54e1994965ef', '3d063cf3-d027-435e-91ff-2dc26608738b', 'membership_hero', 0, 'published', '{"title": "Membership", "primary": {"href": "", "label": "Start Your Application"}, "badgeLabel": "JOIN APECK", "description": "Join a community of passionate clergy committed to excellence in ministry and Kingdom impact", "backgroundImage": "/uploads/1763202264546-175728204.jpg"}', '2025-11-16 09:19:04', '2025-11-16 09:19:04'),
	('6ec93a06-057a-4d7c-a57a-6beb090b2e68', '41504d8a-c971-4656-ae03-8a9938c5cf37', 'programs_hero', 0, 'published', '{"title": "Community Transformation Programs", "badgeLabel": "OUR PROGRAMS", "description": "APECK partners with churches, NACADA, and community leaders to deliver holistic rehabilitation, mediation, youth empowerment, and dignified housing solutions across Kenya.", "backgroundImage": "/uploads/1763202264546-175728204.jpg"}', '2025-11-16 08:33:35', '2025-11-16 08:33:35'),
	('8b569bda-6126-47a8-b536-c06a45960a09', '2cfde759-c162-11f0-ba4f-00155dcfbcb2', 'who_we_are', 0, 'published', '{"cta": {"href": "/about", "label": "Read Our Full Story"}, "image": "/uploads/1763202303871-140188975.jpg", "intro": "APECK is the premier association uniting Pentecostal and Evangelical clergy across Kenya. We are dedicated to empowering spiritual leaders through comprehensive training, mentorship, and resources that enable them to fulfill their calling with excellence.", "stats": [], "title": "Who We Are", "mission": "Our mission is to strengthen the body of Christ by equipping clergy with the tools, knowledge, and support they need to lead transformative ministries that impact communities and advance the Kingdom of God.", "imageAlt": "", "badgeLabel": "WELCOME TO APECK1", "highlightWord": "APECK", "floatingBadgeTitle": "Since 2009", "floatingBadgeSubtitle": "Serving Kenya"}', '2025-11-15 10:57:52', '2025-11-15 10:57:52'),
	('9c3fadc6-3674-49d3-af59-aafb7517d1ca', '41504d8a-c971-4656-ae03-8a9938c5cf37', 'programs_initiatives', 0, 'published', '{"items": [{"icon": "award", "title": "Certified Professional Mediator (CPM) Training", "bullets": [{"text": "Equips pastors with formal mediation credentials."}, {"text": "Promotes peaceful dispute resolution across congregations."}, {"text": "Documents successful couple reunifications and family healing."}], "highlight": "High reconciliation rates and significant drops in domestic violence.", "description": "Clergy are trained as professional mediators to resolve domestic and community conflicts before they escalate."}, {"icon": "sparkles", "title": "Youth Empowerment & Employment", "bullets": [{"text": "Talent discovery labs, mentorship, and digital skills bootcamps."}, {"text": "Entrepreneurship coaching plus access to clergy-led micro grants."}, {"text": "Strong focus on innovation, content creation, and agribusiness."}], "highlight": "Constructive engagement replaces dependency on scarce formal jobs.", "description": "Training programs help youth identify inherent talents, monetize their skills, and build self-reliance."}, {"icon": "home", "title": "Clergy & Youth Economic Empowerment (Housing)", "bullets": [{"text": "Collective savings schemes and bulk land acquisition."}, {"text": "Access to subsidized mortgages and construction support."}, {"text": "Long-term stability that strengthens ministry families."}], "highlight": "Vision: 60,000 clergy and 100,000 youth homeowners.", "description": "The APECK Housing Cooperative partners with the Ministry of Lands and the Affordable Housing Program to unlock dignified living."}], "title": "Complementary Programs", "badgeLabel": "EXPANDING IMPACT", "description": "Beyond rehabilitation, APECK equips clergy, youth, and families with tools for long-term stability."}', '2025-11-16 08:47:51', '2025-11-16 08:47:51'),
	('abfa8c4c-b331-483c-83ee-f3c311158b68', 'c0757362-c162-11f0-ba4f-00155dcfbcb2', 'about_story', 0, 'published', '{"image": "/uploads/1763202273523-705231851.jpg", "title": "Who We Are", "badgeLabel": "OUR STORY", "paragraphs": [{"text": "APECK was founded in 2009 by a group of visionary clergy leaders who recognized the urgent need for a unified platform to support, empower, and connect Pentecostal and Evangelical ministers across Kenya. These founding members, representing diverse denominations and regions, shared a common vision: to create an organization that would bridge divides, foster collaboration, and elevate the standards of clergy practice nationwide."}, {"text": "The initial meetings took place in Nairobi, where 15 founding pastors gathered to discuss the challenges facing clergy in Kenya. They identified critical gaps in training, support systems, and networking opportunities. From these humble beginnings, APECK was officially registered as a national association, establishing its first headquarters in the capital city."}, {"text": "What began as a small gathering of passionate pastors has grown into a national movement representing over 1,500 clergy members from all 47 counties of Kenya. Our growth has been marked by strategic expansion into regional chapters, each led by dedicated coordinators who understand the unique ministry contexts of their areas. From the coastal regions of Mombasa to the highlands of the Rift Valley, APECK has established a presence that truly represents the diversity of Kenya\'s Pentecostal and Evangelical community."}, {"text": "Over the past 15 years, we have facilitated hundreds of training programs, provided mentorship to emerging leaders, and created a supportive community where clergy can grow, learn, and thrive in their calling. Our training initiatives have covered topics ranging from biblical exegesis and theological studies to practical ministry skills including counseling, leadership development, financial management, and community engagement. We\'ve organized 250+ workshops, 47 annual conferences, and numerous online learning opportunities."}, {"text": "Our impact extends beyond training. APECK has facilitated partnerships with international organizations, securing resources and expertise to enhance our programs. We\'ve launched initiatives supporting clergy welfare, including health insurance programs, emergency relief funds, and professional development scholarships. Our advocacy efforts have seen us engage with government bodies on matters affecting religious freedom, clergy welfare, and community development."}, {"text": "The association has been instrumental in establishing mentorship programs that pair experienced clergy with emerging leaders. These relationships have resulted in 300+ mentorship pairings, creating pathways for knowledge transfer and spiritual growth. Through our networking events, regional conferences, and digital platforms, clergy members have found lasting friendships, ministry partnerships, and collaborative opportunities."}, {"text": "Today, APECK stands as a beacon of unity, excellence, and impact in the Kenyan church landscape, continuing to fulfill our mission of empowering clergy for Kingdom impact. We remain committed to our founding principles while adapting to the changing needs of ministry in the 21st century. Our vision for the future includes expanded training facilities, increased digital resources, enhanced member services, and deeper community engagement across all regions of Kenya. We believe that empowered, equipped, and united clergy are essential for the transformation of our nation and the advancement of God\'s Kingdom."}]}', '2025-11-15 17:59:20', '2025-11-15 17:59:20'),
	('bad3515b-3e8e-49c3-83c1-b2a9e593e7ce', '2cfde759-c162-11f0-ba4f-00155dcfbcb2', 'impact_stats', 0, 'published', '{"stats": [{"icon": "users", "label": "Members", "value": "30,000+", "suffix": "+"}, {"icon": "trend", "label": "Counties Reached", "value": "47", "suffix": ""}, {"icon": "book", "label": "Training Programs", "value": "250", "suffix": "+"}, {"icon": "award", "label": "Years of Impact", "value": "15", "suffix": ""}]}', '2025-11-15 11:16:53', '2025-11-15 11:16:53'),
	('bf4cddd6-ad30-4dce-a3b6-e6087bc37497', '3561e394-ae80-4182-b547-0c0ca6d53f37', 'contact_map', 0, 'published', '{"lat": "-1.2839088974298676", "lng": "36.77796722256354", "popup": "APECK Headquarters Nairobi, Kenya", "title": "Find Us", "badgeLabel": "LOCATION", "description": "Visit our office in Nairobi"}', '2025-11-16 12:12:03', '2025-11-16 12:12:03'),
	('d91bbde2-a118-4eed-b841-c6f779b05046', '3d063cf3-d027-435e-91ff-2dc26608738b', 'membership_cta', 0, 'published', '{"title": "Ready to Join APECK?", "badgeLabel": "GET STARTED", "description": "Take the next step in your ministry journey and become part of our community", "primaryLabel": "Start Your Application"}', '2025-11-16 10:06:01', '2025-11-16 10:06:01'),
	('ed59df3f-722c-4527-8777-1c39ca3c1534', '9edd600a-fa54-4a42-bf6f-fe971387ef20', 'gallery_items', 0, 'published', '{"items": [{"url": "/uploads/1763202273523-705231851.jpg", "title": "", "category": ""}, {"url": "/uploads/1763202264546-175728204.jpg", "title": "", "category": ""}, {"url": "/uploads/1763202252148-141842368.jpg", "title": "", "category": ""}, {"url": "/uploads/1763202246845-536160193.jpg", "title": "", "category": ""}, {"url": "/uploads/1763202239842-169679919.jpg", "title": "", "category": ""}]}', '2025-11-16 11:52:07', '2025-11-16 11:52:07'),
	('eec64cee-0ad4-405d-b7ed-f96a40a7d4ec', '3561e394-ae80-4182-b547-0c0ca6d53f37', 'contact_hero', 0, 'published', '{"title": "Contact Us", "badgeLabel": "GET IN TOUCH", "description": "Get in touch with us. We are here to answer your questions and support your ministry", "backgroundImage": "/uploads/1763202246845-536160193.jpg"}', '2025-11-16 12:08:04', '2025-11-16 12:08:04'),
	('f7b7388b-e82a-4d70-8213-11ae7052df31', '41504d8a-c971-4656-ae03-8a9938c5cf37', 'programs_cbr', 0, 'published', '{"image": "/uploads/1763202246845-536160193.jpg", "title": "Community-Based Rehabilitation (CBR)", "metrics": [{"label": "Total Participants", "value": "640"}, {"label": "Reformed", "value": "125"}, {"label": "Reformation Rate", "value": "19.5%"}], "subtitle": "Faith-led reform that scales from Kiambaa to the entire nation.", "originTitle": "Origin & Early Success", "metricsTitle": "", "expansionTitle": "Expansion & Impact Metrics", "partnershipTitle": "NACADA Partnership (Aug 4, 2023)", "originDescription": "In 2016, clergy in Kiambaa began walking with former Mungiki members, multiple drug abusers, and parolees. Through pastoral counseling, restorative mentorship, and consistent follow up, the majority overcame addiction, rejoined their families, and many are now pastors or active church members.", "expansionDescription": "The Kiambaa template quickly spread across Kiambu and, by 2022, every sub-county had a CBR initiative. The Githunguri case study demonstrates the program’s rigor and transparent tracking.", "partnershipDescription": "The NACADA MOU unlocked formal Recovery Coach training, enabling reformed beneficiaries to serve as professional mentors. Thousands of addicts have since recovered and reintegrated through clergy-NACADA collaboration in nearly every county."}', '2025-11-16 08:41:26', '2025-11-16 08:41:26'),
	('fc03ca13-4a34-48e3-beb1-e2fb54dbc5ca', '2cfde759-c162-11f0-ba4f-00155dcfbcb2', 'programs', 0, 'published', '{"cta": {"href": "/programs", "label": "Explore All Programs"}, "items": [{"icon": "book", "title": " Training Programs", "accent": "", "description": "Comprehensive programs designed to empower clergy and strengthen ministry impact"}, {"icon": "users", "title": "Clergy Empowerment", "accent": "", "description": "Resources and support for personal and ministerial growth"}, {"icon": "sparkles", "title": "Leadership Development", "accent": "", "description": "Mentorship and coaching for emerging and established leaders"}, {"icon": "heart", "title": "Community Outreach", "accent": "", "description": "Collaborative initiatives to serve communities across Kenya"}], "title": "Our Programs & Initiatives", "badgeLabel": "OUR SERVICES", "description": "Comprehensive programs designed to empower clergy and strengthen ministry impact"}', '2025-11-15 11:33:54', '2025-11-15 11:33:54');

-- Dumping structure for table apeck.programs
CREATE TABLE IF NOT EXISTS `programs` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `summary` text,
  `body` longtext,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `hero_media_id` char(36) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `programs_slug_unique` (`slug`),
  KEY `programs_hero_media_id_foreign` (`hero_media_id`),
  CONSTRAINT `programs_hero_media_id_foreign` FOREIGN KEY (`hero_media_id`) REFERENCES `media_assets` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.programs: ~0 rows (approximately)

-- Dumping structure for table apeck.routes
CREATE TABLE IF NOT EXISTS `routes` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `slug` varchar(255) NOT NULL,
  `target` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `routes_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.routes: ~0 rows (approximately)

-- Dumping structure for table apeck.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `first_name` varchar(120) NOT NULL,
  `last_name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','editor','viewer') NOT NULL DEFAULT 'viewer',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.users: ~1 rows (approximately)
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `role`, `is_active`, `last_login_at`, `reset_token`, `reset_token_expires_at`, `created_at`, `updated_at`) VALUES
	('dab741fd-4162-456b-aa86-e510311ef18e', 'Site', 'Admin', 'admin@apeck.org', '$2b$12$Kkj8sClCs4CDJbG5qFSIO.CaqSDBcbxkFO9zFxZKZkhekVssYtBZW', 'admin', 1, '2025-11-16 12:42:06', NULL, NULL, '2025-11-14 12:33:01', '2025-11-14 12:33:01');

-- Dumping structure for table apeck.user_sessions
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `refresh_token_hash` varchar(255) NOT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `ip_address` varchar(64) DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_sessions_user_id_index` (`user_id`),
  CONSTRAINT `user_sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table apeck.user_sessions: ~36 rows (approximately)
INSERT INTO `user_sessions` (`id`, `user_id`, `refresh_token_hash`, `user_agent`, `ip_address`, `expires_at`, `created_at`, `updated_at`) VALUES
	('01e08690-09f2-4c76-bb9c-aa31536eb57d', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$pRfl3Z/ao53imsRImWu4guDWjZXvgHSS3TW90cupHTR9Z4cUW/8j.', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:35:57', '2025-11-16 11:35:57', '2025-11-16 11:35:57'),
	('07bc6013-259e-4dd6-b67c-6eeb89fe05d8', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$pArFTpWsyE8EoTobiBZclOYjNtp5SZtyjSDi1E8LZ8NWSbTFRZ3Oe', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 05:13:43', '2025-11-16 08:13:43', '2025-11-16 08:13:43'),
	('0cee2bab-4969-4d99-8cf5-f4341a4a347e', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$0asWzDEVWXR/4Vqy0zzeb.9ZIxYYI8i4JX.mq1eGbY1nRi177MXda', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:02:05', '2025-11-14 13:02:06', '2025-11-14 13:02:06'),
	('10cd81f7-6c6d-40d6-b726-42ddbb6ad34d', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$u6Q79LUMv0bGHWS9aR2ZDe2NSqmGVSfLInmCAg8PR3yTMQpd0j2fe', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:05:52', '2025-11-16 11:05:52', '2025-11-16 11:05:52'),
	('10eeb179-ed3e-4502-b326-d2c8f7d4f00b', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$FHpGv0T4NNc2Dl3DBErlk.lW9akhB9aEXmUic5zjJiheW4mSM/1bC', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 07:33:40', '2025-11-16 10:33:40', '2025-11-16 10:33:40'),
	('1217cb45-defd-4911-ad74-03134fe073ac', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$wDIX7HKN5sFOyrqNJp02rOzZs2pA/v7j77ObTlJO/YdtiqfZSd.1C', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 09:57:20', '2025-11-14 12:57:20', '2025-11-14 12:57:20'),
	('12d6e547-6d07-4e82-aac2-fc7f78c4de59', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$0.8yy4WqirCJ7RFHSMILhe2R47S4DC0lm8nUIVr48BeV5JphPf6c.', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:37:34', '2025-11-16 11:37:34', '2025-11-16 11:37:34'),
	('145200b9-65ec-4fe6-a590-23980e23dfbb', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$cp5rQHzXpiXwML0SAX5w/ej0OgVoagDAfQNWvXHSVdNuw2/9MGpOG', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:49:01', '2025-11-16 11:49:01', '2025-11-16 11:49:01'),
	('16829dd6-d522-42e9-93f8-756a33152573', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$hv/4qnf5me2O.sUJonDwwerjhoD0X8RNnjeubGh8SgOhGPBOTz3.q', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:59:29', '2025-11-14 13:59:28', '2025-11-14 13:59:28'),
	('1c702b2e-d4fa-4bc5-9222-dd98544fff79', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$CNcz4tLjFdyVxQEVmuYsBe5eZNuOA5WFMrowfW8nheo4.ek99i6xq', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 13:03:58', '2025-11-15 16:03:58', '2025-11-15 16:03:58'),
	('1c965052-5478-4d7e-bdf5-b4436f897d02', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$95qw9cfuve0aPgaQwWm0de8XKyjO0CkIQmkCkf18QWeKAKmdACq.O', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 11:22:06', '2025-11-14 14:22:06', '2025-11-14 14:22:06'),
	('1e5fa24c-9b9e-45c2-be69-10593e3da94e', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$S7mHTDY2wsLpPlckmf0vOuwaVUgR9NSTa/cqyAZeQAfhIAC9ZGJBy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:02:30', '2025-11-14 13:02:30', '2025-11-14 13:02:30'),
	('206a998b-365e-4370-a5d0-de1560cdd59b', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$5Ao72pYIrjPle9XwQB976uPSa6Xv.w29J2Fg3ZoNoME5pBxW2VfpW', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 17:26:21', '2025-11-15 20:26:22', '2025-11-15 20:26:22'),
	('2468c49f-b8e8-4e96-8461-9997cda5ae92', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$yeITISaUeOAyXGwgczXVROAJ9PbmDHiUe2pOb6m0MeFOBFtmXzjoy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 11:14:17', '2025-11-14 14:14:17', '2025-11-14 14:14:17'),
	('251df2c6-bc78-42b1-93d5-d3e1452736b4', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$BxZ0wPtkfw6wFCviQV4PJenEh1dclEZcBcu3tp96WWMfRhXwsjfRu', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 12:02:47', '2025-11-14 15:02:47', '2025-11-14 15:02:47'),
	('29ef4e6b-8287-43e5-a786-c3da9fe249d2', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$zOOycngITrxjH8R0JRw2GeKb7dsVKkq80C69W43OEZtQ75MFlKc1W', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 09:07:05', '2025-11-15 12:07:05', '2025-11-15 12:07:05'),
	('2a8d6782-e948-4da6-939a-3e8515a17b30', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$nRW.echdo7DF7yikbP20Ze4SlF0AjK6dCbhWDRPv8WB3.8onK7Tru', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:14:14', '2025-11-14 13:14:15', '2025-11-14 13:14:15'),
	('303c1709-334b-46da-9ea6-a8e390750aa7', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$kvWBj38EystHeXpDthbTsuOWt4MnGeno7tAZHe6a8InkFbjpAiQ9i', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:24:52', '2025-11-16 11:24:52', '2025-11-16 11:24:52'),
	('401728cb-12d4-4078-a88f-ffac93464fb6', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$mz7U7RXu0xXeuS3D/6BYaOgr9lT2u0b1OqalkcJrKt64tNqER0CHO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 06:18:15', '2025-11-16 09:18:15', '2025-11-16 09:18:15'),
	('40c432f0-3a0c-4d1b-9e6d-da26addc045e', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$Sa6sy/Yb0csltJ9irr32ROkXtLSNC11Uu0Y2KihIHEiHxX1rD6cLm', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 07:24:02', '2025-11-16 10:24:02', '2025-11-16 10:24:02'),
	('423302ea-fe8a-4dbf-8035-1dcdfeb00429', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$Dly3FfhU5vx.H/Yo8BuLt.MIpQBc.Boa0llk3r8sIF0akMBbGB3He', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 06:27:04', '2025-11-16 09:27:04', '2025-11-16 09:27:04'),
	('43796fe4-2d57-439c-b3b8-491922d43676', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$11HDzAXOxMNlJ5.H9t38BOCI3/QdiTHrQwam7grmuktjSkSOvEEg6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 06:57:59', '2025-11-16 09:57:59', '2025-11-16 09:57:59'),
	('45898d3d-eebf-47ff-a8a4-6b3314e380a5', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$I1etmpZXd40B/0nw/A7brOU8kHxGskzfY5kvOflGFt7eViXIkWC96', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 09:58:32', '2025-11-14 12:58:33', '2025-11-14 12:58:33'),
	('47e1b3f5-0579-4d03-8cce-b206e248ca85', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$M0Sn9N3PEF5iePQcWyRvleHHiYnAaU.Zb9oErszmp5.9t7G1.0PDO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 09:42:07', '2025-11-16 12:42:07', '2025-11-16 12:42:07'),
	('48ac49b3-fb3f-4cbc-a316-97c499588602', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$gcqhnmVHS.yGIaT3HT8/B.2YrDNphLdxsNjHMJzEkODr7JQRVaNPe', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 05:18:59', '2025-11-16 08:18:59', '2025-11-16 08:18:59'),
	('51126362-6e16-4370-85d8-9446b1a62e91', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$E4FMAojXCP0wiIs5ZuvHAuiAfN6JemIxdkVSbcO.X3ZY2t.NouMNi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:07:50', '2025-11-16 11:07:50', '2025-11-16 11:07:50'),
	('51fdd6c8-7406-40d1-8a2b-70d2d5dccce2', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$KmscPpspvBfvI/uV0.1NlO2CUwyNX7RDpREQAZ01ldIQpR3GBhjRu', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 14:48:43', '2025-11-15 17:48:43', '2025-11-15 17:48:43'),
	('52e744e4-8332-42d0-b6ab-e91b65babea0', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$srIrb5MH5aKtAQFpHlX6keO36HRTfbq6zvyLKXPMcGViSH/GIoBd2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 09:07:15', '2025-11-16 12:07:15', '2025-11-16 12:07:15'),
	('540d2978-8c92-4dac-8068-58a56d017784', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$SmITojA3Np6DxjJWMQxDBOOvQRvHOeCOEua9znt6Ef8aFyWZzSb.e', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 07:21:24', '2025-11-15 10:21:24', '2025-11-15 10:21:24'),
	('5517427b-1b27-47a9-beed-b4093e76621e', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$D5H4QvDlBl/Q.HMYJcR5fuK4x.VvT3JtTTR1MEpPaSFF/hKKvbRsy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 15:04:14', '2025-11-15 18:04:14', '2025-11-15 18:04:14'),
	('5675824f-99f9-4452-900b-ee50a6d1717b', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$cKS4wkCaV9KsJueCuy4n0OmaW3FiC5MHhTheasRBsG2C2hhQFUfnS', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:02:01', '2025-11-14 13:02:02', '2025-11-14 13:02:02'),
	('569c3106-076e-46d6-9c56-712821bb4870', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$HCMkYNPxWXrQSLQr6/q2MOjiT1OZdI2VBMW0cI1MdLAUOifPtY7tu', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 06:52:23', '2025-11-15 09:52:23', '2025-11-15 09:52:23'),
	('60074965-1741-4d07-9541-d7c89d9f9562', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$lqzxr/1NpUlaicSOhkBm3OF/fTG6NTuJcLTqPtiaYJMex/0SGtqaS', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:06:30', '2025-11-14 13:06:30', '2025-11-14 13:06:30'),
	('60b461f2-5fe2-482e-a188-628636f4a09d', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$b4WOTwt7nIw8nv.FnXu1ueMbeAd8mVtCUesP44yoUbgsNHVGsf64S', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 07:57:35', '2025-11-15 10:57:36', '2025-11-15 10:57:36'),
	('6352231f-d002-4231-8ba9-d064a6344bec', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$.os4CcfsVowUi7zrdkPhieZGKdOQ1cuSj/UbED9EmJe9GYleUsbuW', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 07:13:33', '2025-11-16 10:13:33', '2025-11-16 10:13:33'),
	('68283c9e-c81a-4794-8cd3-5ad1e249d764', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$RVQoAShqhttfwcY8MhmrBuL7DPJ3.juQUn7kjbkHJH.SAq/C/2NkG', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:34:03', '2025-11-16 11:34:03', '2025-11-16 11:34:03'),
	('69141a1b-8a4a-42bd-8614-0fcf472ff973', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$xM08IJXjX9./Fie3ByJqye/WVqZzUA2pvksx13cQHLhJt6U3oz1Zy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 06:26:26', '2025-11-15 09:26:26', '2025-11-15 09:26:26'),
	('7109160a-027f-4125-8ce0-c1c17eef6b5a', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$/XFm.8l7qfWvdkTsin1phe71byaaO/jYXHDwXiaGiJOlJ5iqwMcWG', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 06:38:15', '2025-11-16 09:38:15', '2025-11-16 09:38:15'),
	('73ca974f-1b36-49ac-bfcc-3e6ae3fccdb8', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$WIWeXBKnpCRKI0JTTwEEs.ZpbwTojGpyacBYrOSD1JrtSUfIjC6Z6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:27:25', '2025-11-16 11:27:25', '2025-11-16 11:27:25'),
	('7bff1ba1-1f4f-48f8-b5aa-63cc926b0f8a', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$ddVo/O3tBwjDpMB7lmbDge/RULWH7HW/2jIBFteTU1iYjIrvZQkfa', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 16:21:50', '2025-11-15 19:21:50', '2025-11-15 19:21:50'),
	('7c11221b-7979-46b8-946e-7856c3b1dade', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$Movovil927E0dfVYgF1W1ePYpNaPQBjtKQkBfykaW/JVQIlAzZJWW', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 11:12:40', '2025-11-14 14:12:40', '2025-11-14 14:12:40'),
	('7dfaad5d-f3e0-44a7-bd5b-f2efbd1ea84e', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$3NWYYELtBmg/NEkZFrkqr.qDUPTOhZ2fkzJ8iCu6zl0ByeQ/rqkbq', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 09:56:57', '2025-11-14 12:56:58', '2025-11-14 12:56:58'),
	('81870c4a-0d88-4320-b851-9b65e07c3bbd', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$ZR1EkZGyM95daCOQ4v4kauPsIMyRxO8L6lMWQjh/Mg.h92wjUL7ii', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 12:54:58', '2025-11-15 15:54:59', '2025-11-15 15:54:59'),
	('86eadf68-e0c3-4a8d-a097-284794819296', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$VB9wiTkTMSDfKEu7zwGEb.U0zXNfwo4UpeS2dt0mmyuDsLzbOKwLK', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:15:03', '2025-11-14 13:15:04', '2025-11-14 13:15:04'),
	('896b4b5c-92fc-4451-ba80-860549699a30', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$5pG9nL/9zxoArJh/QgsxDeFwomzMp9Oragxqh9Eb6FVLJWAM5eddW', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 14:08:03', '2025-11-15 17:08:03', '2025-11-15 17:08:03'),
	('89ccdb0c-0db9-467e-a842-b8a4bc491be9', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$s/l5S9LBqTipUNy24ffZKud78fKPs/LZvTeFRZUzrgPNz6TUZq1j2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:43:17', '2025-11-16 11:43:17', '2025-11-16 11:43:17'),
	('90f74b66-d1bf-4048-b968-3ee52adf3a01', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$yhMyboMIf2MoiWHeY1IFT.Jdy0ATWBpX1i0G7rliMb1ada6FVkJdK', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:14:43', '2025-11-14 13:14:44', '2025-11-14 13:14:44'),
	('9231a269-10ca-47f4-b66d-788d6740ad49', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$SmCkYxTqOA9ken4wmJrfxuFfzJe4Noaicwpbur0KAWmoMqAvcdY16', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 08:33:40', '2025-11-15 11:33:40', '2025-11-15 11:33:40'),
	('964ebe6a-a2f4-4933-bbc8-c12b00821eb0', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$tcOBgVYsAeSJZWj954h.F.6adPSbqPeo.9uw3G2N5uiKB5BDVBSUC', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 08:16:25', '2025-11-15 11:16:26', '2025-11-15 11:16:26'),
	('9651152f-60b1-4ac5-b93f-47321e47c296', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$5J.I.weyd74q3dW9VKPlpeUm0KKsD3RYOesuHxBYmj.voLn0ZwJUC', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:06:17', '2025-11-14 13:06:18', '2025-11-14 13:06:18'),
	('99bb97d8-b3e8-4744-b02a-b089967298f6', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$CVRSgwYZhjtDxBTbkAgAf.d5b.YUbw0jhaYXUNMoF/gEnuTOKzIve', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 07:15:25', '2025-11-15 10:15:25', '2025-11-15 10:15:25'),
	('a30d3595-dba9-4d3b-931c-bdf22c066461', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$SLV18Npn/s4zOiN5h1CepujVMTw4.orLPCsf.lLQNzogu8iIv850.', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:06:02', '2025-11-14 13:06:02', '2025-11-14 13:06:02'),
	('a7805c8c-ba23-41f9-a0e6-cfb9d399932a', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$rz8MYBfyDaXiKMFBjs5zjOEGIDPZVpVX1SNriBumFpJ1T5cYnzAfq', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 05:52:08', '2025-11-16 08:52:08', '2025-11-16 08:52:08'),
	('ab2d67ef-4373-4b83-8692-37ec2568745c', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$B2NA/YQZ/GDwo8002g.JEO6gEZbog5/nGM5lJhvPKRSKZVtt8z8QC', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:41:54', '2025-11-16 11:41:54', '2025-11-16 11:41:54'),
	('b03646c3-bed8-47f4-92ed-52949e69f314', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$cK7xn7X0EYGGHuQHDZpHcel91U6ZQCCW4NLU61NxDdcFYrgA3f8yW', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 14:26:14', '2025-11-15 17:26:14', '2025-11-15 17:26:14'),
	('b14b1f3d-f6f2-4a0e-b96e-cecee8c1459d', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$RsNjrM2fnEPKEWI4XxvDTe7va1ednkg3YKwlX0ftARNw/PTKV221u', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:11:33', '2025-11-16 11:11:33', '2025-11-16 11:11:33'),
	('bcfbb0e6-e88d-48e6-867c-0f6e353e6d95', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$OTG1ddm0trCwdwURUHL6D.7IMciOp/cvmF7R1b2v11MiJzADyktDq', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 11:46:01', '2025-11-14 14:46:01', '2025-11-14 14:46:01'),
	('c489749b-20bc-4140-88c2-57c832af63f8', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$eFcRFdbc9k4Ehy1pVFolheNddo7Uf1Rx7zorTzqy2A81sw5wSH2da', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 07:09:35', '2025-11-15 10:09:36', '2025-11-15 10:09:36'),
	('c5f01a20-1821-465b-b3f4-2833e450d49e', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$QFGr3p48W6bAjpA6K5WKlehUCggNh5SAh1ZTg8WrXDET1U/jeGuRG', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:21:17', '2025-11-16 11:21:17', '2025-11-16 11:21:17'),
	('c9696058-0826-4a49-bb17-9be14ef45a66', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$xzWVNtecBHnK0iFs79404eIK8rfOjY8PNGmWu8zuxi/JuE0Mqz4em', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 11:43:17', '2025-11-14 14:43:17', '2025-11-14 14:43:17'),
	('cafc2b13-d950-4c72-8c39-b1c62f2479b2', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$9qF4nxWxvjKSgzFsR8nY6O.5iB4QGDtsBzt4/b2gBmz/Hr0EeIqyK', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:19:47', '2025-11-16 11:19:46', '2025-11-16 11:19:46'),
	('d0244917-cf04-4b77-8f87-9fde45b3cfee', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$4kpA9PAIojVkxgl0Rq7WVeECO6PK4rLp2ypLTClgc6NQ4vNLUJF/e', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:16:54', '2025-11-14 13:16:54', '2025-11-14 13:16:54'),
	('d8a39042-0d40-4910-969a-6666f8ca9710', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$Qdf7ds3JeSuqllsZcW/R.ueFpM5OyizE3cNgXb0u4ZoZbIR0o3qiq', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 04:24:50', '2025-11-16 07:24:50', '2025-11-16 07:24:50'),
	('d901f70e-6c77-45ad-9614-f81641718993', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$OMdqY3Ivy2ddHpk1bek7outIGZzDnbfbfHnbJx8mcyLY7sardvMRq', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:06:54', '2025-11-14 13:06:54', '2025-11-14 13:06:54'),
	('df9e3e21-bd8f-47d8-970f-73eb36f0a083', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$/uzPTXKOmTw6Ela1BDOF..gtfT.Xoi/7JJJlmiqurGx9xsQNr/Dn2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 06:57:20', '2025-11-15 09:57:19', '2025-11-15 09:57:19'),
	('e327907a-e1ca-4ad6-8c82-afee65d9b6ae', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$I1Y4Y9iOTgPcehaenw9jteSKXAFXyfZR81Pwm75xFq8hT/.O92y0.', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:06:27', '2025-11-14 13:06:27', '2025-11-14 13:06:27'),
	('e4f9f227-1316-4bb3-8be2-b6e37bf89b2b', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$TgJN6ywpqtGP4t1vhxR1tOfaCmKkc/0rh76Okig88TV4R9bRpWQ.2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:07:39', '2025-11-16 11:07:39', '2025-11-16 11:07:39'),
	('e62b4961-6b3b-4454-a281-5384a4e91bf8', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$5IAmSmrIgYU.AY.z1wnRNe67TwekM2Kn2ddclTq7bG1pBh0iQtx0K', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:12:09', '2025-11-14 13:12:10', '2025-11-14 13:12:10'),
	('e80a3830-285c-404d-b1a3-084a187a57ad', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$hElU9gArjQFsF0O8rIOPIe3mJYLHzv9zkUGU6aIiFUXcmJWFoZOqK', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 12:54:13', '2025-11-15 15:54:13', '2025-11-15 15:54:13'),
	('e9669720-dcaf-4bcb-82c7-d6096ff2ca73', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$JmnXZZKVd8oSNcmDEmgUMe47SS6yIdFuNfndnT0Dyz.ztVwnxIZFm', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 13:42:31', '2025-11-15 16:42:31', '2025-11-15 16:42:31'),
	('edb8d469-c72e-4ce9-a350-1003952eb44f', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$DU6ibWdFkpaSa8XDcuyhFO0XdZjcQfLdEEuq8lz4cJ5RIBUsvIJju', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 08:38:42', '2025-11-16 11:38:42', '2025-11-16 11:38:42'),
	('f08815c1-ed67-4f45-8cd7-c92a3ca91f4b', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$HytKQB8toCxHAchLH0yPYeZ06Cs5wy0T3EBKYUlcsmqHITkGy9LbO', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 07:37:15', '2025-11-15 10:37:15', '2025-11-15 10:37:15'),
	('f5f69a03-9d02-4128-82ac-3173a4a76f08', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$EPPTdkPRu9klXMyQbvN.FOatdzfSmuXUW37mSM2bH.gVrPeSE.hO2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-23 05:34:23', '2025-11-16 08:34:23', '2025-11-16 08:34:23'),
	('fb48c7bb-24ec-489b-8ac5-9dee0cfdc41a', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$UVtehoEVi3hZL8zDfQbeMerl5ini.a3CJeDqRr4oVjbXVe4dLsKre', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-22 09:27:33', '2025-11-15 12:27:33', '2025-11-15 12:27:33'),
	('ff6188e3-81df-4e39-95d9-dff5481212c8', 'dab741fd-4162-456b-aa86-e510311ef18e', '$2b$12$M6qjQ9asIJ91Q32NDjj5VOxbkwh56o5vVX0DieMRRnH71fkCAxet2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1', '2025-11-21 10:02:09', '2025-11-14 13:02:09', '2025-11-14 13:02:09');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
