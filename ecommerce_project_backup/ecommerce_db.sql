-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2025 at 12:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckAndUpdateOrderStatus` (IN `order_id` INT)   BEGIN
    DECLARE total_items INT;
    DECLARE delivered_items INT;
    DECLARE order_status VARCHAR(20);
    
    -- Get total items and delivered items count
    SELECT COUNT(*), SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END)
    INTO total_items, delivered_items
    FROM order_items 
    WHERE order_id = order_id;
    
    -- Get current order status
    SELECT status INTO order_status FROM orders WHERE id = order_id;
    
    -- Update order status if all items are delivered and current status is not already delivered
    IF total_items > 0 AND delivered_items = total_items AND order_status != 'delivered' THEN
        UPDATE orders 
        SET status = 'delivered', updated_at = CURRENT_TIMESTAMP 
        WHERE id = order_id;
        
        -- Add to tracking history
        INSERT INTO tracking_history (order_id, status, description, location, updated_by)
        VALUES (order_id, 'delivered', 'All items in order have been delivered', 'Customer Location', 1);
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ManageStockOnOrderChange` (IN `order_id` INT, IN `action_type` ENUM('create','cancel','payment_failed'), IN `user_id` INT)   BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE product_id_val INT;
    DECLARE quantity_val INT;
    DECLARE order_number_val VARCHAR(50);
    DECLARE reason_text VARCHAR(255);
    
    -- Cursor for order items
    DECLARE order_items_cursor CURSOR FOR 
        SELECT oi.product_id, oi.quantity 
        FROM order_items oi 
        WHERE oi.order_id = order_id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Get order number
    SELECT order_number INTO order_number_val FROM orders WHERE id = order_id;
    
    -- Set reason based on action
    CASE action_type
        WHEN 'create' THEN SET reason_text = CONCAT('Order created: ', order_number_val);
        WHEN 'cancel' THEN SET reason_text = CONCAT('Order cancelled: ', order_number_val);
        WHEN 'payment_failed' THEN SET reason_text = CONCAT('Payment failed for order: ', order_number_val);
    END CASE;
    
    OPEN order_items_cursor;
    
    read_loop: LOOP
        FETCH order_items_cursor INTO product_id_val, quantity_val;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Update product stock based on action
        IF action_type = 'create' THEN
            UPDATE products SET quantity = quantity - quantity_val WHERE id = product_id_val;
            INSERT INTO stock_history (product_id, adjustment, reason, created_by) 
            VALUES (product_id_val, -quantity_val, reason_text, user_id);
        ELSE
            -- For cancel or payment_failed, restore stock
            UPDATE products SET quantity = quantity + quantity_val WHERE id = product_id_val;
            INSERT INTO stock_history (product_id, adjustment, reason, created_by) 
            VALUES (product_id_val, quantity_val, reason_text, user_id);
        END IF;
    END LOOP;
    
    CLOSE order_items_cursor;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-10-16 09:09:43', '2025-10-16 09:09:43'),
(2, 12, '2025-11-19 09:50:27', '2025-11-19 09:50:27');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`, `created_at`) VALUES
(21, 2, 32, 1, '2025-11-19 09:51:17'),
(30, 1, 1, 1, '2025-12-04 11:40:57');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `parent_id`, `image_url`, `created_at`) VALUES
(1, 'Electronics', 'Latest electronic gadgets, smartphones, laptops, and accessories', NULL, 'uploads/electronics_category.svg', '2025-10-16 08:16:14'),
(2, 'Clothing', 'Fashionable clothing for men, women, and children', NULL, 'uploads/clothing_category.svg', '2025-10-16 08:16:14'),
(3, 'Home & Kitchen', 'Everything for your home including furniture, kitchenware, and decor', NULL, 'uploads/home_kitchen_category.svg', '2025-10-16 08:16:14'),
(4, 'Books', 'Books for all ages and interests including fiction, non-fiction, and educational', NULL, 'uploads/books_category.svg', '2025-10-16 08:16:14'),
(9, 'Smartphones', 'Latest smartphones and mobile devices', 1, 'uploads/smartphones_category.svg', '2025-10-18 15:05:02'),
(10, 'Laptops', 'Laptops, notebooks, and computing devices', 1, 'uploads/laptops_category.svg', '2025-10-18 15:05:02'),
(11, 'Tablets', 'Tablets and portable computing devices', 1, 'uploads/tablets_category.svg', '2025-10-18 15:05:02'),
(12, 'Men\'s Clothing', 'Clothing for men', 2, 'uploads/mens_clothing_category.svg', '2025-10-18 15:05:02'),
(13, 'Women\'s Clothing', 'Clothing for women', 2, 'uploads/womens_clothing_category.svg', '2025-10-18 15:05:02'),
(14, 'Kitchen Appliances', 'Kitchen tools and appliances', 3, 'uploads/kitchen_appliances_category.svg', '2025-10-18 15:05:02'),
(15, 'Home Decor', 'Home decoration items', 3, 'uploads/home_decor_category.svg', '2025-10-18 15:05:02'),
(16, 'Fiction', 'Fiction books and novels', 4, 'uploads/fiction_category.svg', '2025-10-18 15:05:02'),
(17, 'Non-Fiction', 'Non-fiction and educational books', 4, 'uploads/non_fiction_category.svg', '2025-10-18 15:05:02'),
(19, 'Food and Drinks', 'Here this category will contain food and drinks like beer', NULL, NULL, '2025-11-24 12:38:54');

-- --------------------------------------------------------

--
-- Table structure for table `category_suggestions`
--

CREATE TABLE `category_suggestions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `suggested_by` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category_suggestions`
--

INSERT INTO `category_suggestions` (`id`, `name`, `description`, `parent_id`, `suggested_by`, `status`, `admin_notes`, `created_at`, `updated_at`) VALUES
(1, 'Food and Drinks', 'Here this category will contain food and drinks like beer', NULL, 1, 'approved', '', '2025-11-24 11:04:28', '2025-11-24 12:38:54');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percentage','fixed') DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `valid_from` datetime DEFAULT NULL,
  `valid_until` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `auto_apply` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `discount_type`, `discount_value`, `min_order_amount`, `max_discount_amount`, `usage_limit`, `used_count`, `valid_from`, `valid_until`, `is_active`, `created_at`, `auto_apply`) VALUES
(1, 'WELCOME10', 'fixed', 10.00, 0.00, 20.00, 1000, 256, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2024-01-01 08:00:00', 0),
(2, 'SAVE15', 'percentage', 15.00, 50.00, 30.00, 500, 92, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2024-01-01 08:00:00', 0),
(3, 'FREESHIP', 'fixed', 9.99, 25.00, NULL, 2000, 570, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2024-01-01 08:00:00', 0),
(4, 'SUMMER25', 'percentage', 25.00, 100.00, 50.00, 100, 44, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2024-05-15 08:00:00', 0),
(5, 'FIRSTORDER', 'fixed', 5.00, 0.00, NULL, 5000, 1239, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2024-01-01 08:00:00', 0),
(6, 'BIGSPENDER', 'percentage', 20.00, 200.00, 100.00, 50, 17, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2024-01-01 08:00:00', 0),
(7, 'LOYALTY10', 'percentage', 10.00, 0.00, 25.00, NULL, 681, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2024-01-01 08:00:00', 0),
(8, 'FLASH50', 'percentage', 50.00, 150.00, 75.00, 10, 0, '2024-12-01 00:00:00', '2024-12-02 23:59:59', 1, '2024-02-28 08:00:00', 0),
(9, 'WINTER2024', 'fixed', 15.00, 75.00, NULL, 300, 47, '2024-11-01 00:00:00', '2025-02-28 23:59:59', 1, '2024-10-15 08:00:00', 0),
(10, 'NEWUSER5', 'fixed', 5.00, 0.00, NULL, 10000, 2895, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2024-01-01 08:00:00', 0),
(12, 'WELCOME2024', 'percentage', 15.00, 0.00, 25.00, 1000, 0, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-11-02 13:38:24', 1),
(13, 'FREESHIPPING', 'fixed', 12.99, 35.00, NULL, 5000, 235, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-11-02 13:38:24', 1),
(14, 'HOLIDAY25', 'percentage', 25.00, 75.00, 50.00, 500, 89, '2024-11-20 00:00:00', '2025-01-15 23:59:59', 1, '2025-11-02 13:38:24', 0),
(15, 'FLASH30', 'percentage', 30.00, 50.00, 40.00, 200, 45, '2024-12-01 00:00:00', '2024-12-03 23:59:59', 1, '2025-11-02 13:38:24', 1),
(16, 'STUDENT10', 'percentage', 10.00, 25.00, 20.00, NULL, 156, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-11-02 13:38:24', 0),
(17, 'FIRSTBUY', 'fixed', 8.00, 0.00, NULL, 10000, 2895, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-11-02 13:38:24', 1),
(18, 'BULK20', 'percentage', 20.00, 150.00, 75.00, 300, 67, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-11-02 13:38:24', 0),
(19, 'LOYAL15', 'percentage', 15.00, 0.00, 30.00, NULL, 892, '2024-01-01 00:00:00', NULL, 1, '2025-11-02 13:38:24', 1),
(20, 'NEWYEAR2025', 'percentage', 20.00, 40.00, 35.00, 800, 0, '2024-12-26 00:00:00', '2025-01-10 23:59:59', 1, '2025-11-02 13:38:24', 1),
(21, 'QUICK10', 'fixed', 10.00, 30.00, NULL, 1500, 423, '2024-01-01 00:00:00', '2025-06-30 23:59:59', 1, '2025-11-02 13:38:24', 1),
(22, 'HELLO', 'fixed', 50.00, 4.00, NULL, 5, 0, '2025-12-06 00:00:00', '2025-12-03 00:00:00', 1, '2025-12-09 13:26:57', 0);

-- --------------------------------------------------------

--
-- Table structure for table `delivery_attempts`
--

CREATE TABLE `delivery_attempts` (
  `id` int(11) NOT NULL,
  `tracking_id` int(11) NOT NULL,
  `attempt_number` int(11) DEFAULT 1,
  `attempt_date` datetime DEFAULT NULL,
  `status` enum('successful','failed','rescheduled') DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `location_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`location_data`)),
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_proofs`
--

CREATE TABLE `delivery_proofs` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `tracking_id` int(11) NOT NULL,
  `proof_type` enum('signature','photo','otp','location','timestamp') DEFAULT NULL,
  `proof_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`proof_data`)),
  `verified_by` int(11) DEFAULT NULL,
  `verified_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_tracking`
--

CREATE TABLE `delivery_tracking` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `carrier` varchar(50) DEFAULT 'standard',
  `status` enum('pending','picked_up','in_transit','out_for_delivery','delivered','failed') DEFAULT 'pending',
  `estimated_delivery` date DEFAULT NULL,
  `actual_delivery` datetime DEFAULT NULL,
  `proof_of_delivery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`proof_of_delivery`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  `order_number` varchar(50) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
  `payment_status` enum('pending','processing','paid','failed','cancelled','refunded') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `shipping_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`shipping_address`)),
  `billing_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`billing_address`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `coupon_id`, `order_number`, `total_amount`, `status`, `payment_status`, `payment_method`, `shipping_address`, `billing_address`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'ORD-1001', 3689.98, 'delivered', 'paid', 'credit_card', '{\"name\": \"John Doe\", \"street\": \"123 Main St\", \"city\": \"New York\", \"state\": \"NY\", \"zip\": \"10001\", \"country\": \"USA\", \"phone\": \"+1-555-0101\"}', '{\"name\": \"John Doe\", \"street\": \"123 Main St\", \"city\": \"New York\", \"state\": \"NY\", \"zip\": \"10001\", \"country\": \"USA\"}', '2025-10-08 15:37:39', '2025-11-02 13:41:04'),
(2, 1, 2, 'ORD1760894138135', 2405.47, 'delivered', 'paid', 'credit_card', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"US\",\"phone\":\"(073) 779-8270\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"US\"}', '2025-10-19 17:15:38', '2025-11-30 12:21:10'),
(3, 7, 1, 'ORD-2024-001', 1289.98, 'delivered', 'paid', 'credit_card', '{\"firstName\": \"John\", \"lastName\": \"Doe\", \"street\": \"456 Oak Avenue\", \"city\": \"Los Angeles\", \"state\": \"CA\", \"zipCode\": \"90210\", \"country\": \"US\", \"phone\": \"(555) 123-4567\", \"email\": \"john.doe@email.com\"}', '{\"firstName\": \"John\", \"lastName\": \"Doe\", \"street\": \"456 Oak Avenue\", \"city\": \"Los Angeles\", \"state\": \"CA\", \"zipCode\": \"90210\", \"country\": \"US\"}', '2024-01-20 08:30:00', '2025-11-28 13:45:40'),
(4, 8, 2, 'ORD-2024-002', 161.47, 'delivered', 'paid', 'paypal', '{\"firstName\": \"Sarah\", \"lastName\": \"Wilson\", \"street\": \"789 Pine Street\", \"city\": \"Chicago\", \"state\": \"IL\", \"zipCode\": \"60601\", \"country\": \"US\", \"phone\": \"(555) 234-5678\", \"email\": \"sarah.wilson@email.com\"}', '{\"firstName\": \"Sarah\", \"lastName\": \"Wilson\", \"street\": \"789 Pine Street\", \"city\": \"Chicago\", \"state\": \"IL\", \"zipCode\": \"60601\", \"country\": \"US\"}', '2024-02-15 12:45:00', '2025-11-02 14:35:36'),
(5, 9, 1, 'ORD-2024-003', 2489.99, 'shipped', 'paid', 'credit_card', '{\"firstName\": \"Mike\", \"lastName\": \"Johnson\", \"street\": \"321 Maple Drive\", \"city\": \"Houston\", \"state\": \"TX\", \"zipCode\": \"77001\", \"country\": \"US\", \"phone\": \"(555) 345-6789\", \"email\": \"mike.johnson@email.com\"}', '{\"firstName\": \"Mike\", \"lastName\": \"Johnson\", \"street\": \"321 Maple Drive\", \"city\": \"Houston\", \"state\": \"TX\", \"zipCode\": \"77001\", \"country\": \"US\"}', '2024-03-08 07:15:00', '2025-11-02 13:41:04'),
(6, 10, 2, 'ORD-2024-004', 280.46, 'delivered', 'paid', 'credit_card', '{\"firstName\": \"Lisa\", \"lastName\": \"Brown\", \"street\": \"654 Cedar Road\", \"city\": \"Phoenix\", \"state\": \"AZ\", \"zipCode\": \"85001\", \"country\": \"US\", \"phone\": \"(555) 456-7890\", \"email\": \"lisa.brown@email.com\"}', '{\"firstName\": \"Lisa\", \"lastName\": \"Brown\", \"street\": \"654 Cedar Road\", \"city\": \"Phoenix\", \"state\": \"AZ\", \"zipCode\": \"85001\", \"country\": \"US\"}', '2024-04-12 14:20:00', '2025-11-02 14:35:36'),
(7, 11, 13, 'ORD-2024-005', 136.98, 'delivered', 'paid', 'paypal', '{\"firstName\": \"David\", \"lastName\": \"Smith\", \"street\": \"987 Birch Lane\", \"city\": \"Philadelphia\", \"state\": \"PA\", \"zipCode\": \"19101\", \"country\": \"US\", \"phone\": \"(555) 567-8901\", \"email\": \"david.smith@email.com\"}', '{\"firstName\": \"David\", \"lastName\": \"Smith\", \"street\": \"987 Birch Lane\", \"city\": \"Philadelphia\", \"state\": \"PA\", \"zipCode\": \"19101\", \"country\": \"US\"}', '2024-05-20 09:30:00', '2025-11-02 14:35:36'),
(8, 12, 13, 'ORD-2024-006', 1787.00, 'confirmed', 'paid', 'credit_card', '{\"firstName\": \"Emily\", \"lastName\": \"Clark\", \"street\": \"147 Walnut Street\", \"city\": \"San Antonio\", \"state\": \"TX\", \"zipCode\": \"78201\", \"country\": \"US\", \"phone\": \"(555) 678-9012\", \"email\": \"emily.clark@email.com\"}', '{\"firstName\": \"Emily\", \"lastName\": \"Clark\", \"street\": \"147 Walnut Street\", \"city\": \"San Antonio\", \"state\": \"TX\", \"zipCode\": \"78201\", \"country\": \"US\"}', '2024-06-25 11:45:00', '2025-11-02 13:41:04'),
(9, 13, 13, 'ORD-2024-007', 76.99, 'delivered', 'paid', 'credit_card', '{\"firstName\": \"Robert\", \"lastName\": \"Wilson\", \"street\": \"258 Spruce Avenue\", \"city\": \"San Diego\", \"state\": \"CA\", \"zipCode\": \"92101\", \"country\": \"US\", \"phone\": \"(555) 789-0123\", \"email\": \"robert.wilson@email.com\"}', '{\"firstName\": \"Robert\", \"lastName\": \"Wilson\", \"street\": \"258 Spruce Avenue\", \"city\": \"San Diego\", \"state\": \"CA\", \"zipCode\": \"92101\", \"country\": \"US\"}', '2024-07-18 13:10:00', '2025-11-02 14:35:36'),
(10, 14, NULL, 'ORD-2024-008', 1099.99, 'shipped', 'paid', 'credit_card', '{\"firstName\": \"Jennifer\", \"lastName\": \"Lee\", \"street\": \"369 Elm Street\", \"city\": \"Dallas\", \"state\": \"TX\", \"zipCode\": \"75201\", \"country\": \"US\", \"phone\": \"(555) 890-1234\", \"email\": \"jennifer.lee@email.com\"}', '{\"firstName\": \"Jennifer\", \"lastName\": \"Lee\", \"street\": \"369 Elm Street\", \"city\": \"Dallas\", \"state\": \"TX\", \"zipCode\": \"75201\", \"country\": \"US\"}', '2024-08-05 08:25:00', '2025-10-26 20:37:20'),
(11, 15, NULL, 'ORD-2024-009', 199.99, 'delivered', 'paid', 'paypal', '{\"firstName\": \"Kevin\", \"lastName\": \"Martin\", \"street\": \"741 Oak Lane\", \"city\": \"San Jose\", \"state\": \"CA\", \"zipCode\": \"95101\", \"country\": \"US\", \"phone\": \"(555) 901-2345\", \"email\": \"kevin.martin@email.com\"}', '{\"firstName\": \"Kevin\", \"lastName\": \"Martin\", \"street\": \"741 Oak Lane\", \"city\": \"San Jose\", \"state\": \"CA\", \"zipCode\": \"95101\", \"country\": \"US\"}', '2024-09-22 10:40:00', '2025-11-25 12:02:46'),
(12, 16, NULL, 'ORD-2024-010', 1599.99, 'pending', 'paid', 'credit_card', '{\"firstName\": \"Amanda\", \"lastName\": \"Taylor\", \"street\": \"852 Pine Road\", \"city\": \"Austin\", \"state\": \"TX\", \"zipCode\": \"73301\", \"country\": \"US\", \"phone\": \"(555) 012-3456\", \"email\": \"amanda.taylor@email.com\"}', '{\"firstName\": \"Amanda\", \"lastName\": \"Taylor\", \"street\": \"852 Pine Road\", \"city\": \"Austin\", \"state\": \"TX\", \"zipCode\": \"73301\", \"country\": \"US\"}', '2024-10-15 12:55:00', '2025-10-26 20:37:20'),
(13, 7, NULL, 'ORD-2024-011', 79.99, 'delivered', 'paid', 'credit_card', '{\"firstName\": \"John\", \"lastName\": \"Doe\", \"street\": \"456 Oak Avenue\", \"city\": \"Los Angeles\", \"state\": \"CA\", \"zipCode\": \"90210\", \"country\": \"US\", \"phone\": \"(555) 123-4567\", \"email\": \"john.doe@email.com\"}', '{\"firstName\": \"John\", \"lastName\": \"Doe\", \"street\": \"456 Oak Avenue\", \"city\": \"Los Angeles\", \"state\": \"CA\", \"zipCode\": \"90210\", \"country\": \"US\"}', '2024-03-10 06:20:00', '2025-11-02 14:35:36'),
(14, 8, NULL, 'ORD-2024-012', 129.97, 'delivered', 'paid', 'paypal', '{\"firstName\": \"Sarah\", \"lastName\": \"Wilson\", \"street\": \"789 Pine Street\", \"city\": \"Chicago\", \"state\": \"IL\", \"zipCode\": \"60601\", \"country\": \"US\", \"phone\": \"(555) 234-5678\", \"email\": \"sarah.wilson@email.com\"}', '{\"firstName\": \"Sarah\", \"lastName\": \"Wilson\", \"street\": \"789 Pine Street\", \"city\": \"Chicago\", \"state\": \"IL\", \"zipCode\": \"60601\", \"country\": \"US\"}', '2024-05-25 15:30:00', '2025-10-26 20:37:20'),
(15, 9, NULL, 'ORD-2024-013', 849.99, 'shipped', 'paid', 'credit_card', '{\"firstName\": \"Mike\", \"lastName\": \"Johnson\", \"street\": \"321 Maple Drive\", \"city\": \"Houston\", \"state\": \"TX\", \"zipCode\": \"77001\", \"country\": \"US\", \"phone\": \"(555) 345-6789\", \"email\": \"mike.johnson@email.com\"}', '{\"firstName\": \"Mike\", \"lastName\": \"Johnson\", \"street\": \"321 Maple Drive\", \"city\": \"Houston\", \"state\": \"TX\", \"zipCode\": \"77001\", \"country\": \"US\"}', '2024-07-30 07:45:00', '2025-10-26 20:37:20'),
(16, 10, NULL, 'ORD-2024-014', 49.99, 'delivered', 'paid', 'credit_card', '{\"firstName\": \"Lisa\", \"lastName\": \"Brown\", \"street\": \"654 Cedar Road\", \"city\": \"Phoenix\", \"state\": \"AZ\", \"zipCode\": \"85001\", \"country\": \"US\", \"phone\": \"(555) 456-7890\", \"email\": \"lisa.brown@email.com\"}', '{\"firstName\": \"Lisa\", \"lastName\": \"Brown\", \"street\": \"654 Cedar Road\", \"city\": \"Phoenix\", \"state\": \"AZ\", \"zipCode\": \"85001\", \"country\": \"US\"}', '2024-08-18 12:15:00', '2025-11-02 14:35:36'),
(17, 11, NULL, 'ORD-2024-015', 299.97, 'delivered', 'paid', 'paypal', '{\"firstName\": \"David\", \"lastName\": \"Smith\", \"street\": \"987 Birch Lane\", \"city\": \"Philadelphia\", \"state\": \"PA\", \"zipCode\": \"19101\", \"country\": \"US\", \"phone\": \"(555) 567-8901\", \"email\": \"david.smith@email.com\"}', '{\"firstName\": \"David\", \"lastName\": \"Smith\", \"street\": \"987 Birch Lane\", \"city\": \"Philadelphia\", \"state\": \"PA\", \"zipCode\": \"19101\", \"country\": \"US\"}', '2024-09-05 14:50:00', '2025-11-28 13:45:43'),
(18, 12, NULL, 'ORD-2024-016', 1199.99, 'confirmed', 'paid', 'credit_card', '{\"firstName\": \"Emily\", \"lastName\": \"Clark\", \"street\": \"147 Walnut Street\", \"city\": \"San Antonio\", \"state\": \"TX\", \"zipCode\": \"78201\", \"country\": \"US\", \"phone\": \"(555) 678-9012\", \"email\": \"emily.clark@email.com\"}', '{\"firstName\": \"Emily\", \"lastName\": \"Clark\", \"street\": \"147 Walnut Street\", \"city\": \"San Antonio\", \"state\": \"TX\", \"zipCode\": \"78201\", \"country\": \"US\"}', '2024-10-10 09:25:00', '2025-10-26 20:37:20'),
(19, 13, NULL, 'ORD-2024-017', 39.99, 'delivered', 'paid', 'credit_card', '{\"firstName\": \"Robert\", \"lastName\": \"Wilson\", \"street\": \"258 Spruce Avenue\", \"city\": \"San Diego\", \"state\": \"CA\", \"zipCode\": \"92101\", \"country\": \"US\", \"phone\": \"(555) 789-0123\", \"email\": \"robert.wilson@email.com\"}', '{\"firstName\": \"Robert\", \"lastName\": \"Wilson\", \"street\": \"258 Spruce Avenue\", \"city\": \"San Diego\", \"state\": \"CA\", \"zipCode\": \"92101\", \"country\": \"US\"}', '2024-02-28 11:40:00', '2025-11-02 14:35:36'),
(20, 14, NULL, 'ORD-2024-018', 899.99, 'shipped', 'paid', 'credit_card', '{\"firstName\": \"Jennifer\", \"lastName\": \"Lee\", \"street\": \"369 Elm Street\", \"city\": \"Dallas\", \"state\": \"TX\", \"zipCode\": \"75201\", \"country\": \"US\", \"phone\": \"(555) 890-1234\", \"email\": \"jennifer.lee@email.com\"}', '{\"firstName\": \"Jennifer\", \"lastName\": \"Lee\", \"street\": \"369 Elm Street\", \"city\": \"Dallas\", \"state\": \"TX\", \"zipCode\": \"75201\", \"country\": \"US\"}', '2024-04-22 13:55:00', '2025-10-26 20:37:20'),
(21, 1, NULL, 'ORD1761569401886', 6039.95, 'cancelled', 'pending', 'credit_card', '{\"firstName\":\"Habimana\",\"lastName\":\"hero\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"RWANDA\",\"phone\":\"(073) 779-8117\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Habimana\",\"lastName\":\"hero\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"RWANDA\"}', '2025-10-27 12:50:01', '2025-11-17 18:02:07'),
(22, 1, NULL, 'ORD1761806250436', 6799.96, 'cancelled', 'pending', 'credit_card', '{\"firstName\":\"charis\",\"lastName\":\"mubaraka\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"RWANDA\",\"phone\":\"(073) 779-8117\",\"email\":\"test@example.com\"}', '{\"firstName\":\"charis\",\"lastName\":\"mubaraka\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"RWANDA\"}', '2025-10-30 06:37:30', '2025-11-17 17:59:24'),
(23, 1, NULL, 'ORD1761853449680', 29.99, 'delivered', 'paid', 'credit_card', '{\"firstName\":\"Habimana\",\"lastName\":\"chris\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"RWANDA\",\"phone\":\"(073) 779-8117\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Habimana\",\"lastName\":\"chris\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"RWANDA\"}', '2025-10-30 19:44:09', '2025-11-02 14:35:36'),
(24, 1, 1, 'ORD1762093959750', 19.99, 'delivered', 'paid', 'credit_card', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"RWANDA\",\"phone\":\"(073) 779-8270\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"RWANDA\"}', '2025-11-02 14:32:39', '2025-11-02 14:33:05'),
(25, 1, 6, 'ORD1762779841977', 3299.98, 'cancelled', 'pending', 'credit_card', '{\"firstName\":\"Rukundo hero\",\"lastName\":\"hero\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"RWANDA\",\"phone\":\"(073) 779-8117\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Rukundo hero\",\"lastName\":\"hero\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"hhhh\",\"zipCode\":\"745678\",\"country\":\"RWANDA\"}', '2025-11-10 13:04:01', '2025-11-17 17:58:25'),
(26, 1, 1, 'ORD1764070525995', 19.99, 'delivered', 'paid', 'mtn_rwanda', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\",\"phone\":\"+250795223480\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\"}', '2025-11-25 11:35:26', '2025-11-25 11:37:48'),
(27, 1, 6, 'ORD1764447120071', 1899.98, 'pending', 'pending', 'momo', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\",\"phone\":\"+250737798270\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\"}', '2025-11-29 20:12:00', '2025-11-29 20:12:00'),
(28, 1, 1, 'ORD1764504170728', 19.99, 'delivered', 'paid', 'momo', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\",\"phone\":\"+250737798270\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\"}', '2025-11-30 12:02:50', '2025-12-01 17:34:36'),
(29, 1, 1, 'ORD1764610428396', 19.99, 'pending', 'pending', 'airtel_money', '{\"firstName\":\"Habimana\",\"lastName\":\"chris\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\",\"phone\":\"+250737798117\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Habimana\",\"lastName\":\"chris\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\"}', '2025-12-01 17:33:48', '2025-12-01 17:33:48'),
(30, 1, 1, 'ORD1764610701590', 19.99, 'pending', 'pending', 'momo', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\",\"phone\":\"+250737798270\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\"}', '2025-12-01 17:38:21', '2025-12-01 17:38:21'),
(31, 1, 1, 'ORD1764695054282', 19.99, 'cancelled', 'cancelled', 'momo', '{\"firstName\":\"Habimana\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\",\"phone\":\"+250737798270\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Habimana\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\"}', '2025-12-02 17:04:14', '2025-12-02 17:22:25'),
(32, 1, 13, 'ORD1764696499467', 46.99, 'pending', 'pending', 'momo', '{\"firstName\":\"Mwizerwa Iyakare\",\"lastName\":\"Sony Anthime\",\"street\":\"karongi\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\",\"phone\":\"+250737798270\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Mwizerwa Iyakare\",\"lastName\":\"Sony Anthime\",\"street\":\"karongi\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\"}', '2025-12-02 17:28:19', '2025-12-02 17:28:19'),
(33, 1, 6, 'ORD1764848424508', 899.99, 'pending', 'processing', 'momo', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\",\"phone\":\"+250737798270\",\"email\":\"test@example.com\"}', '{\"firstName\":\"Rukundo\",\"lastName\":\"Moses\",\"street\":\"kigali-rwanda\",\"city\":\"kigali\",\"state\":\"nyarugenge\",\"country\":\"RWANDA\"}', '2025-12-04 11:40:24', '2025-12-04 11:40:24');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
  `seller_id` int(11) DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`, `status`, `seller_id`, `tracking_number`, `updated_at`) VALUES
(1, 2, 10, 1, 1799.99, '2025-10-19 17:15:38', 'confirmed', 4, NULL, '2025-11-01 17:51:54'),
(2, 2, 7, 1, 999.99, '2025-10-19 17:15:38', 'confirmed', 4, NULL, '2025-11-01 17:52:03'),
(3, 2, 32, 1, 29.99, '2025-10-19 17:15:38', 'delivered', 1, '1234567890', '2025-11-01 17:55:21'),
(4, 3, 1, 1, 999.99, '2025-10-26 20:37:20', 'delivered', 2, NULL, '2025-11-28 11:03:33'),
(5, 3, 16, 1, 79.99, '2025-10-26 20:37:20', 'pending', 5, NULL, '2025-10-30 19:33:55'),
(6, 3, 29, 1, 16.99, '2025-10-26 20:37:20', 'pending', 2, NULL, '2025-10-30 19:33:55'),
(7, 3, 31, 1, 15.99, '2025-10-26 20:37:20', 'pending', 2, NULL, '2025-10-30 19:33:55'),
(8, 4, 14, 2, 29.99, '2025-10-26 20:37:20', 'pending', 5, NULL, '2025-10-30 19:33:55'),
(9, 4, 15, 1, 49.99, '2025-10-26 20:37:20', 'pending', 5, NULL, '2025-10-30 19:33:55'),
(10, 4, 19, 1, 59.99, '2025-10-26 20:37:20', 'pending', 5, NULL, '2025-10-30 19:33:55'),
(11, 5, 9, 1, 2499.99, '2025-10-26 20:37:20', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(12, 6, 17, 2, 39.99, '2025-10-26 20:37:20', 'pending', 5, NULL, '2025-10-30 19:33:55'),
(13, 6, 18, 1, 89.99, '2025-10-26 20:37:20', 'pending', 5, NULL, '2025-10-30 19:33:55'),
(14, 6, 25, 1, 39.99, '2025-10-26 20:37:20', 'pending', 6, NULL, '2025-10-30 19:33:55'),
(15, 6, 32, 2, 29.99, '2025-10-26 20:37:20', 'delivered', 1, '1567890', '2025-11-01 17:55:51'),
(16, 7, 3, 1, 129.99, '2025-10-26 20:37:20', 'pending', 5, NULL, '2025-10-30 19:33:55'),
(17, 7, 5, 1, 39.99, '2025-10-26 20:37:20', 'pending', 2, NULL, '2025-10-30 19:33:55'),
(18, 8, 10, 1, 1799.99, '2025-10-26 20:37:20', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(19, 9, 21, 1, 89.99, '2025-10-26 20:37:20', 'pending', 6, NULL, '2025-10-30 19:33:55'),
(20, 10, 12, 1, 1099.99, '2025-10-26 20:37:20', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(22, 12, 11, 1, 1599.99, '2025-10-26 20:37:20', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(23, 13, 22, 1, 79.99, '2025-10-26 20:37:20', 'pending', 6, NULL, '2025-10-30 19:33:55'),
(24, 14, 23, 1, 49.99, '2025-10-26 20:37:20', 'pending', 6, NULL, '2025-10-30 19:33:55'),
(25, 14, 25, 1, 39.99, '2025-10-26 20:37:20', 'pending', 6, NULL, '2025-10-30 19:33:55'),
(26, 14, 4, 1, 79.99, '2025-10-26 20:37:20', 'pending', 6, NULL, '2025-10-30 19:33:55'),
(27, 15, 7, 1, 849.99, '2025-10-26 20:37:20', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(28, 16, 26, 1, 12.99, '2025-10-26 20:37:20', 'pending', 2, NULL, '2025-10-30 19:33:55'),
(29, 16, 28, 1, 13.99, '2025-10-26 20:37:20', 'pending', 2, NULL, '2025-10-30 19:33:55'),
(30, 16, 30, 1, 18.99, '2025-10-26 20:37:20', 'pending', 2, NULL, '2025-10-30 19:33:55'),
(32, 17, 25, 2, 39.99, '2025-10-26 20:37:20', 'pending', 6, NULL, '2025-10-30 19:33:55'),
(33, 17, 32, 1, 29.99, '2025-10-26 20:37:20', 'delivered', 1, '1234567890', '2025-10-31 11:19:20'),
(34, 18, 6, 1, 1199.99, '2025-10-26 20:37:20', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(35, 19, 27, 1, 14.99, '2025-10-26 20:37:20', 'pending', 2, NULL, '2025-10-30 19:33:55'),
(36, 19, 29, 1, 16.99, '2025-10-26 20:37:20', 'pending', 2, NULL, '2025-10-30 19:33:55'),
(37, 20, 8, 1, 899.99, '2025-10-26 20:37:20', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(38, 21, 9, 1, 2499.99, '2025-10-27 12:50:01', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(39, 21, 12, 1, 1099.99, '2025-10-27 12:50:01', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(40, 21, 17, 1, 39.99, '2025-10-27 12:50:01', 'pending', 5, NULL, '2025-10-30 19:33:55'),
(41, 21, 6, 2, 1199.99, '2025-10-27 12:50:01', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(42, 22, 8, 2, 899.99, '2025-10-30 06:37:30', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(43, 22, 9, 2, 2499.99, '2025-10-30 06:37:30', 'pending', 4, NULL, '2025-10-30 19:33:55'),
(44, 23, 32, 1, 29.99, '2025-10-30 19:44:09', 'delivered', NULL, '1234', '2025-11-01 17:55:59'),
(45, 24, 32, 1, 29.99, '2025-11-02 14:32:39', 'delivered', NULL, NULL, '2025-11-02 14:33:05'),
(46, 25, 8, 1, 899.99, '2025-11-10 13:04:01', 'pending', NULL, NULL, '2025-11-10 13:04:01'),
(47, 25, 9, 1, 2499.99, '2025-11-10 13:04:01', 'pending', NULL, NULL, '2025-11-10 13:04:01'),
(48, 26, 32, 1, 29.99, '2025-11-25 11:35:26', 'delivered', NULL, NULL, '2025-11-25 11:37:48'),
(49, 27, 7, 2, 999.99, '2025-11-29 20:12:00', 'pending', 4, NULL, '2025-11-29 20:12:00'),
(50, 28, 32, 1, 29.99, '2025-11-30 12:02:50', 'delivered', 1, NULL, '2025-12-01 17:34:36'),
(51, 29, 32, 1, 29.99, '2025-12-01 17:33:48', 'pending', 1, NULL, '2025-12-01 17:33:48'),
(52, 30, 32, 1, 29.99, '2025-12-01 17:38:21', 'pending', 1, NULL, '2025-12-01 17:38:21'),
(53, 31, 32, 1, 29.99, '2025-12-02 17:04:14', 'pending', 1, NULL, '2025-12-02 17:04:14'),
(54, 32, 32, 2, 29.99, '2025-12-02 17:28:19', 'pending', 1, NULL, '2025-12-02 17:28:19'),
(55, 33, 1, 1, 999.99, '2025-12-04 11:40:24', 'pending', 1, NULL, '2025-12-04 11:40:24');

--
-- Triggers `order_items`
--
DELIMITER $$
CREATE TRIGGER `after_order_item_update` AFTER UPDATE ON `order_items` FOR EACH ROW BEGIN
    IF NEW.status = 'delivered' THEN
        CALL CheckAndUpdateOrderStatus(NEW.order_id);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `pawapay_webhook_logs`
--

CREATE TABLE `pawapay_webhook_logs` (
  `id` int(11) NOT NULL,
  `webhook_id` varchar(255) DEFAULT NULL,
  `event_type` varchar(100) DEFAULT NULL,
  `merchant_reference` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `processed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'USD',
  `merchant_reference` varchar(100) NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `status` enum('pending','processing','completed','failed','cancelled','refunded') DEFAULT 'pending',
  `provider_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`provider_response`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `user_id`, `payment_method`, `amount`, `currency`, `merchant_reference`, `transaction_id`, `status`, `provider_response`, `created_at`, `updated_at`) VALUES
(1, 33, 1, 'momo', 899.99, 'USD', 'PAWA33_1764848424563', 'mock_tx_1764848424570', 'processing', '{\"transactionId\":\"mock_tx_1764848424570\",\"status\":\"pending\",\"paymentUrl\":null,\"instructions\":\"Check your mobile device for payment request\",\"merchantReference\":\"PAWA33_1764848424563\",\"timestamp\":\"2025-12-04T11:40:24.570Z\"}', '2025-12-04 11:40:24', '2025-12-04 11:40:24');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `compare_price` decimal(10,2) DEFAULT NULL,
  `cost_per_item` decimal(10,2) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `seller_id` int(11) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `track_quantity` tinyint(1) DEFAULT 1,
  `quantity` int(11) DEFAULT 0,
  `is_published` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `requires_shipping` tinyint(1) DEFAULT 1,
  `weight` decimal(8,2) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sales_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `compare_price`, `cost_per_item`, `category_id`, `seller_id`, `sku`, `barcode`, `track_quantity`, `quantity`, `is_published`, `is_featured`, `requires_shipping`, `weight`, `seo_title`, `seo_description`, `created_at`, `updated_at`, `sales_count`) VALUES
(1, 'iPhone 14 Pro', 'Latest Apple smartphone with advanced camera', 999.99, 1000.00, 999.99, 9, 1, 'IP14P-256', '194253774099', 1, 48, 1, 1, 1, NULL, 'iPhone 14 Pro - Advanced Camera', 'Latest Apple iPhone with professional camera system', '2025-10-16 08:28:11', '2025-12-04 11:40:24', 1),
(2, 'Samsung Galaxy S23', 'Powerful Android smartphone', 849.99, 949.99, 600.00, 9, 2, 'SGS23-256', '887276825431', 1, 30, 1, 1, 1, 0.18, 'Samsung Galaxy S23', 'Powerful Android smartphone with advanced features', '2025-10-16 08:28:11', '2025-10-18 15:28:11', 0),
(3, 'Nike Air Max', 'Comfortable running shoes', 129.99, 149.99, 80.00, 12, 5, 'NIKE-AM-001', '123456789001', 1, 97, 1, 0, 1, 0.80, 'Nike Air Max Shoes', 'Comfortable running shoes for active lifestyle', '2025-10-16 08:28:11', '2025-10-26 20:37:20', 0),
(4, 'Coffee Maker', 'Automatic drip coffee maker', 79.99, 99.99, 50.00, 14, 6, 'COFFEE-MKR01', '123456789002', 1, 22, 1, 0, 1, 3.50, 'Automatic Coffee Maker', 'Automatic drip coffee maker for home use', '2025-10-16 08:28:11', '2025-10-26 20:37:20', 0),
(5, 'Python Programming Book', 'Learn Python programming', 39.99, 49.99, 20.00, 17, 2, 'BOOK-PYTHON01', '9780123456789', 1, 197, 1, 1, 1, 0.60, 'Python Programming Book', 'Learn Python programming from beginner to advanced', '2025-10-16 08:28:11', '2025-10-26 20:37:20', 0),
(6, 'iPhone 15 Pro', 'Latest Apple iPhone with advanced camera and A17 Pro chip', 1199.99, 1299.99, 800.00, 9, 1, 'IP15P-256', '194253774100', 1, 24, 1, 1, 1, 0.20, 'iPhone 15 Pro - Best Smartphone', 'Get the latest iPhone 15 Pro with advanced features and camera system', '2025-10-18 15:13:35', '2025-11-27 20:16:17', 0),
(7, 'Samsung Galaxy S24', 'Powerful Android smartphone with advanced AI features', 999.99, 1099.99, 650.00, 9, 4, 'SGS24-256', '887276825432', 1, 26, 1, 1, 1, 0.18, 'Samsung Galaxy S24', 'Experience the power of AI with Samsung Galaxy S24', '2025-10-18 15:13:35', '2025-11-29 20:12:00', 0),
(8, 'Google Pixel 8 Pro', 'Google\'s flagship phone with best-in-class camera', 899.99, 999.99, 600.00, 9, 4, 'GP8P-256', '840364147324', 1, 19, 1, 0, 1, 0.19, 'Google Pixel 8 Pro', 'Google Pixel 8 Pro with advanced computational photography', '2025-10-18 15:13:35', '2025-11-17 17:59:24', 0),
(9, 'MacBook Pro 16', 'Apple MacBook Pro with M3 Max chip and 16-inch display', 2499.99, 2799.99, 1800.00, 10, 4, 'MBP16-M3', '194253017260', 1, 14, 1, 1, 1, 2.10, 'MacBook Pro 16-inch', 'Professional laptop for creators and developers', '2025-10-18 15:13:35', '2025-11-28 12:31:36', 0),
(10, 'Dell XPS 15', 'Dell XPS 15 with Intel Core i7 and 4K display', 1799.99, 1999.99, 1200.00, 10, 4, 'DXPS15-I7', '884116367158', 1, 16, 1, 0, 1, 2.00, 'Dell XPS 15 Laptop', 'Premium Windows laptop for professionals', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(11, 'Lenovo ThinkPad X1', 'Business laptop with superior keyboard and security', 1599.99, 1799.99, 1100.00, 10, 4, 'LTX1-I7', '887654321098', 1, 21, 1, 0, 1, 1.80, 'Lenovo ThinkPad X1', 'Reliable business laptop for professionals', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(12, 'iPad Pro 12.9\"', 'Apple iPad Pro with M2 chip and Liquid Retina display', 1099.99, 1299.99, 700.00, 11, 4, 'IPADP12-M2', '885974123654', 1, 19, 1, 1, 1, 0.68, 'iPad Pro 12.9-inch', 'Professional tablet for creative work', '2025-10-18 15:13:35', '2025-11-17 18:02:07', 0),
(13, 'Samsung Galaxy Tab S9', 'Premium Android tablet with S Pen included', 849.99, 949.99, 550.00, 11, 4, 'SGTS9-256', '887654987321', 1, 25, 1, 0, 1, 0.58, 'Samsung Galaxy Tab S9', 'Powerful Android tablet for productivity', '2025-10-18 15:13:35', '2025-10-18 15:13:35', 0),
(14, 'Men\'s Casual Shirt', 'Comfortable cotton casual shirt for men', 29.99, 39.99, 15.00, 12, 5, 'MCS-BLUE-M', '123456789012', 1, 48, 1, 0, 1, 0.30, 'Men Casual Shirt', 'Comfortable cotton shirt for casual wear', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(15, 'Men\'s Jeans', 'Classic blue denim jeans for men', 49.99, 59.99, 25.00, 12, 5, 'MJ-BLUE-32', '123456789013', 1, 37, 1, 0, 1, 0.50, 'Men Jeans', 'Classic denim jeans for everyday wear', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(16, 'Men\'s Running Shoes', 'Lightweight running shoes for men', 79.99, 99.99, 40.00, 12, 5, 'MRS-BLACK-10', '123456789014', 1, 32, 1, 1, 1, 0.80, 'Men Running Shoes', 'Comfortable running shoes for active lifestyle', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(17, 'Women\'s Summer Dress', 'Beautiful floral summer dress for women', 39.99, 49.99, 20.00, 13, 5, 'WSD-FLORAL-M', '123456789015', 1, 43, 1, 1, 1, 0.25, 'Women Summer Dress', 'Elegant floral dress for summer occasions', '2025-10-18 15:13:35', '2025-11-17 18:02:07', 0),
(18, 'Women\'s Handbag', 'Leather handbag for women with multiple compartments', 89.99, 119.99, 50.00, 13, 5, 'WHB-BLACK', '123456789016', 1, 25, 1, 0, 1, 0.60, 'Women Handbag', 'Stylish leather handbag for everyday use', '2025-10-18 15:13:35', '2025-10-18 15:13:35', 0),
(19, 'Women\'s Sneakers', 'Comfortable white sneakers for women', 59.99, 79.99, 30.00, 13, 5, 'WSN-WHITE-7', '123456789017', 1, 35, 1, 0, 1, 0.70, 'Women Sneakers', 'Comfortable and stylish white sneakers', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(21, 'Air Fryer', 'Digital air fryer with multiple cooking functions', 89.99, 129.99, 50.00, 14, 6, 'AF-5L-DIGITAL', '123456789019', 1, 27, 1, 0, 1, 4.20, 'Air Fryer', 'Healthy cooking with digital air fryer', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(22, 'Blender', 'High-speed blender for smoothies and food processing', 79.99, 99.99, 40.00, 14, 6, 'BLEND-PRO', '123456789020', 1, 35, 1, 0, 1, 3.80, 'Professional Blender', 'Powerful blender for all your kitchen needs', '2025-10-18 15:13:35', '2025-10-18 15:13:35', 0),
(23, 'Bed Sheet Set', 'Queen size cotton bed sheet set', 49.99, 69.99, 25.00, 15, 6, 'BSS-QUEEN-WHITE', '123456789021', 1, 60, 1, 0, 1, 1.80, 'Bed Sheet Set', 'Comfortable cotton bed sheet set', '2025-10-18 15:13:35', '2025-10-18 15:13:35', 0),
(25, 'Table Lamp', 'Modern LED table lamp with touch control', 39.99, 59.99, 20.00, 15, 6, 'LAMP-LED-TABLE', '123456789023', 1, 38, 1, 0, 1, 1.20, 'Table Lamp', 'Modern LED lamp for your desk or bedside', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(26, 'The Great Gatsby', 'Classic novel by F. Scott Fitzgerald', 12.99, 15.99, 6.00, 16, 2, 'BOOK-TGG-001', '9780743273565', 1, 97, 1, 1, 1, 0.40, 'The Great Gatsby', 'Classic American novel by F. Scott Fitzgerald', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(27, 'To Kill a Mockingbird', 'Harper Lee\'s Pulitzer Prize-winning novel', 14.99, 18.99, 7.00, 16, 2, 'BOOK-TKAM-001', '9780061120084', 1, 82, 1, 0, 1, 0.45, 'To Kill a Mockingbird', 'Pulitzer Prize-winning novel by Harper Lee', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(28, '1984', 'George Orwell\'s dystopian masterpiece', 13.99, 16.99, 6.50, 16, 2, 'BOOK-1984-001', '9780451524935', 1, 87, 1, 0, 1, 0.42, '1984 by George Orwell', 'Classic dystopian novel about totalitarianism', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(29, 'Atomic Habits', 'Build good habits and break bad ones', 16.99, 19.99, 8.00, 17, 2, 'BOOK-AH-001', '9780735211292', 1, 72, 1, 1, 1, 0.50, 'Atomic Habits', 'Practical guide to building good habits', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(30, 'Sapiens: A Brief History', 'History of humankind by Yuval Noah Harari', 18.99, 22.99, 9.00, 17, 2, 'BOOK-SAPIENS-001', '9780062316097', 1, 62, 1, 0, 1, 0.55, 'Sapiens Book', 'Brief history of humankind', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(31, 'The Psychology of Money', 'Timeless lessons on wealth and greed', 15.99, 19.99, 7.50, 17, 2, 'BOOK-POM-001', '9780857197689', 1, 67, 1, 0, 1, 0.48, 'Psychology of Money', 'Understanding money and investing psychology', '2025-10-18 15:13:35', '2025-10-26 20:37:20', 0),
(32, 'Web Development Books', 'Comprehensive guide for developers from beginner to professional', 29.99, 39.99, 15.00, 4, 1, 'WEB-DEV-001', '9781234567890', 1, 44, 1, 1, 1, 1.00, 'Web Development Book', 'Complete web development guide for all levels', '2025-10-18 14:02:37', '2025-12-02 17:28:19', 13);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_primary`, `created_at`) VALUES
(1, 32, '/uploads/webdevelopment_book_1760796157209.jpg', 1, '2025-10-18 14:02:37'),
(2, 6, '/uploads/iphone_15_pro.svg', 1, '2025-10-18 15:13:35'),
(3, 7, '/uploads/samsung_galaxy_s24.svg', 1, '2025-10-18 15:13:35'),
(4, 8, '/uploads/google_pixel_8_pro.svg', 1, '2025-10-18 15:13:35'),
(5, 9, '/uploads/macbook_pro_16.svg', 1, '2025-10-18 15:13:35'),
(6, 10, '/uploads/dell_xps_15.svg', 1, '2025-10-18 15:13:35'),
(7, 11, '/uploads/lenovo_thinkpad.svg', 1, '2025-10-18 15:13:35'),
(8, 12, '/uploads/ipad_pro.svg', 1, '2025-10-18 15:13:35'),
(9, 13, '/uploads/samsung_galaxy_tab.svg', 1, '2025-10-18 15:13:35'),
(10, 14, '/uploads/mens_casual_shirt.svg', 1, '2025-10-18 15:13:35'),
(11, 15, '/uploads/mens_jeans.svg', 1, '2025-10-18 15:13:35'),
(12, 16, '/uploads/mens_running_shoes.svg', 1, '2025-10-18 15:13:35'),
(13, 17, '/uploads/womens_summer_dress.svg', 1, '2025-10-18 15:13:35'),
(14, 18, '/uploads/womens_handbag.svg', 1, '2025-10-18 15:13:35'),
(15, 19, '/uploads/womens_sneakers.svg', 1, '2025-10-18 15:13:35'),
(17, 21, '/uploads/air_fryer.svg', 1, '2025-10-18 15:13:35'),
(18, 22, '/uploads/blender.svg', 1, '2025-10-18 15:13:35'),
(19, 23, '/uploads/bed_sheet_set.svg', 1, '2025-10-18 15:13:35'),
(21, 25, '/uploads/table_lamp.svg', 1, '2025-10-18 15:13:35'),
(22, 26, '/uploads/great_gatsby.svg', 1, '2025-10-18 15:13:35'),
(23, 27, '/uploads/mockingbird.svg', 1, '2025-10-18 15:13:35'),
(24, 28, '/uploads/1984_book.svg', 1, '2025-10-18 15:13:35'),
(25, 29, '/uploads/atomic_habits.svg', 1, '2025-10-18 15:13:35'),
(26, 30, '/uploads/sapiens_book.svg', 1, '2025-10-18 15:13:35'),
(27, 31, '/uploads/psychology_money.svg', 1, '2025-10-18 15:13:35'),
(30, 1, '/uploads/iphone_14_pro_1764326908048.jpg', 1, '2025-11-28 10:48:28');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `moderated_by` int(11) DEFAULT NULL,
  `moderated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `rating`, `comment`, `is_approved`, `moderated_by`, `moderated_at`, `created_at`, `updated_at`) VALUES
(1, 7, 1, 5, 'Excellent phone! The camera quality is amazing and battery life lasts all day.', 1, NULL, NULL, '2024-02-01 08:00:00', '2025-11-17 14:43:05'),
(2, 8, 14, 4, 'Good quality shirt, fits well. Would recommend.', 1, NULL, NULL, '2024-03-05 12:30:00', '2025-11-17 14:43:05'),
(3, 9, 9, 5, 'Best laptop I have ever owned. The performance is incredible for video editing.', 1, NULL, NULL, '2024-04-10 07:15:00', '2025-11-17 14:43:05'),
(4, 10, 17, 4, 'Beautiful dress, perfect for summer. The fabric is light and comfortable.', 1, NULL, NULL, '2024-05-15 14:45:00', '2025-11-17 14:43:05'),
(5, 11, 3, 3, 'Shoes are comfortable but the sizing runs small. Order half size up.', 1, NULL, NULL, '2024-06-20 09:20:00', '2025-11-17 14:43:05'),
(6, 12, 10, 5, 'Great laptop for the price. The 4K display is stunning.', 1, NULL, NULL, '2024-07-25 11:10:00', '2025-11-17 14:43:05'),
(7, 13, 21, 4, 'Air fryer works well, easy to clean. Family loves it!', 1, NULL, NULL, '2024-08-30 13:35:00', '2025-11-17 14:43:05'),
(8, 14, 12, 5, 'iPad Pro is perfect for my design work. The Apple Pencil integration is seamless.', 1, NULL, NULL, '2024-09-10 06:50:00', '2025-11-17 14:43:05'),
(10, 16, 11, 5, 'ThinkPad is built like a tank. Perfect for business use.', 1, NULL, NULL, '2024-10-20 12:40:00', '2025-11-17 14:43:05'),
(11, 7, 29, 5, 'Life-changing book! The habits framework really works.', 1, NULL, NULL, '2024-03-15 08:30:00', '2025-11-17 14:43:05'),
(12, 8, 25, 4, 'Nice lamp, good brightness control. Modern design.', 1, NULL, NULL, '2024-06-05 15:20:00', '2025-11-17 14:43:05'),
(13, 9, 7, 4, 'Good Android phone, the AI features are useful.', 1, 1, '2025-11-19 08:12:04', '2024-08-15 07:45:00', '2025-11-19 08:12:04'),
(14, 10, 32, 5, 'Comprehensive web development guide. Perfect for beginners and pros alike.', 1, NULL, NULL, '2024-05-25 09:55:00', '2025-11-17 14:43:05'),
(15, 1, 32, 5, 'good', 1, 1, '2025-11-25 11:46:00', '2025-11-15 13:11:19', '2025-11-25 11:46:00');

-- --------------------------------------------------------

--
-- Table structure for table `stock_history`
--

CREATE TABLE `stock_history` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `adjustment` int(11) NOT NULL COMMENT 'Positive for stock in, negative for stock out',
  `reason` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_history`
--

INSERT INTO `stock_history` (`id`, `product_id`, `adjustment`, `reason`, `created_by`, `created_at`) VALUES
(1, 32, 50, 'Initial stock', 1, '2025-10-18 15:00:29'),
(2, 32, -20, 'Damaged items', 1, '2025-10-18 15:31:39'),
(3, 1, -1, 'Order #ORD-2024-001', 1, '2025-10-26 20:37:20'),
(4, 16, -1, 'Order #ORD-2024-001', 1, '2025-10-26 20:37:20'),
(5, 29, -1, 'Order #ORD-2024-001', 1, '2025-10-26 20:37:20'),
(6, 31, -1, 'Order #ORD-2024-001', 1, '2025-10-26 20:37:20'),
(7, 14, -2, 'Order #ORD-2024-002', 1, '2025-10-26 20:37:20'),
(8, 15, -1, 'Order #ORD-2024-002', 1, '2025-10-26 20:37:20'),
(9, 19, -1, 'Order #ORD-2024-002', 1, '2025-10-26 20:37:20'),
(10, 9, -1, 'Order #ORD-2024-003', 1, '2025-10-26 20:37:20'),
(11, 17, -2, 'Order #ORD-2024-004', 1, '2025-10-26 20:37:20'),
(12, 18, -1, 'Order #ORD-2024-004', 1, '2025-10-26 20:37:20'),
(13, 25, -1, 'Order #ORD-2024-004', 1, '2025-10-26 20:37:20'),
(14, 32, -2, 'Order #ORD-2024-004', 1, '2025-10-26 20:37:20'),
(15, 3, -1, 'Order #ORD-2024-005', 1, '2025-10-26 20:37:20'),
(16, 5, -1, 'Order #ORD-2024-005', 1, '2025-10-26 20:37:20'),
(17, 10, -1, 'Order #ORD-2024-006', 1, '2025-10-26 20:37:20'),
(18, 21, -1, 'Order #ORD-2024-007', 1, '2025-10-26 20:37:20'),
(19, 12, -1, 'Order #ORD-2024-008', 1, '2025-10-26 20:37:20'),
(21, 11, -1, 'Order #ORD-2024-010', 1, '2025-10-26 20:37:20'),
(22, 22, -1, 'Order #ORD-2024-011', 1, '2025-10-26 20:37:20'),
(23, 23, -1, 'Order #ORD-2024-012', 1, '2025-10-26 20:37:20'),
(24, 25, -1, 'Order #ORD-2024-012', 1, '2025-10-26 20:37:20'),
(25, 4, -1, 'Order #ORD-2024-012', 1, '2025-10-26 20:37:20'),
(26, 7, -1, 'Order #ORD-2024-013', 1, '2025-10-26 20:37:20'),
(27, 26, -1, 'Order #ORD-2024-014', 1, '2025-10-26 20:37:20'),
(28, 28, -1, 'Order #ORD-2024-014', 1, '2025-10-26 20:37:20'),
(29, 30, -1, 'Order #ORD-2024-014', 1, '2025-10-26 20:37:20'),
(31, 25, -2, 'Order #ORD-2024-015', 1, '2025-10-26 20:37:20'),
(32, 32, -1, 'Order #ORD-2024-015', 1, '2025-10-26 20:37:20'),
(33, 6, -1, 'Order #ORD-2024-016', 1, '2025-10-26 20:37:20'),
(34, 27, -1, 'Order #ORD-2024-017', 1, '2025-10-26 20:37:20'),
(35, 29, -1, 'Order #ORD-2024-017', 1, '2025-10-26 20:37:20'),
(36, 8, -1, 'Order #ORD-2024-018', 1, '2025-10-26 20:37:20'),
(37, 32, -1, 'Order created: ORD1764695054282', 1, '2025-12-02 17:04:14'),
(38, 32, 1, 'Order cancelled: ORD1764695054282', 1, '2025-12-02 17:22:25'),
(39, 32, -2, 'Order created: ORD1764696499467', 1, '2025-12-02 17:28:19'),
(40, 1, -1, 'Order created: ORD1764848424508', 1, '2025-12-04 11:40:24');

-- --------------------------------------------------------

--
-- Table structure for table `tracking_history`
--

CREATE TABLE `tracking_history` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `status` enum('pending','confirmed','shipped','delivered','cancelled') NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `updated_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tracking_history`
--

INSERT INTO `tracking_history` (`id`, `order_id`, `status`, `description`, `location`, `notes`, `updated_by`, `created_at`) VALUES
(1, 2, 'delivered', 'Payment confirmed by seller', 'System', 'Order marked as paid by seller', 1, '2025-10-25 14:54:13'),
(2, 3, 'confirmed', 'Order confirmed and payment processed', 'Warehouse A', 'Ready for packaging', 1, '2024-01-20 09:00:00'),
(3, 3, 'shipped', 'Order shipped via standard delivery', 'Distribution Center', 'Tracking number: TRK00123456', 1, '2024-01-21 12:30:00'),
(4, 3, 'delivered', 'Package delivered successfully', 'Los Angeles, CA', 'Signed by recipient', 1, '2024-01-23 08:15:00'),
(5, 4, 'confirmed', 'Order confirmed and payment processed', 'Warehouse B', 'Items picked', 1, '2024-02-15 13:30:00'),
(6, 4, 'shipped', 'Order shipped via express delivery', 'Distribution Center', 'Tracking number: TRK00123457', 1, '2024-02-16 07:45:00'),
(7, 4, 'delivered', 'Package delivered successfully', 'Chicago, IL', 'Left at front door', 1, '2024-02-18 11:20:00'),
(8, 5, 'confirmed', 'Order confirmed and payment processed', 'Warehouse A', 'High-value item - special handling', 1, '2024-03-08 08:00:00'),
(9, 5, 'shipped', 'Order shipped with insurance', 'Distribution Center', 'Tracking number: TRK00123458', 1, '2024-03-09 14:15:00'),
(10, 6, 'confirmed', 'Order confirmed and payment processed', 'Warehouse B', 'Multiple items - consolidated package', 1, '2024-04-12 15:00:00'),
(11, 6, 'shipped', 'Order shipped via standard delivery', 'Distribution Center', 'Tracking number: TRK00123459', 1, '2024-04-13 09:30:00'),
(12, 6, 'delivered', 'Package delivered successfully', 'Phoenix, AZ', 'Received by customer', 1, '2024-04-15 12:45:00'),
(13, 7, 'confirmed', 'Order confirmed and payment processed', 'Warehouse A', 'Standard processing', 1, '2024-05-20 10:00:00'),
(14, 7, 'shipped', 'Order shipped via standard delivery', 'Distribution Center', 'Tracking number: TRK00123460', 1, '2024-05-21 08:15:00'),
(15, 7, 'delivered', 'Package delivered successfully', 'Philadelphia, PA', 'Left with neighbor', 1, '2024-05-23 14:30:00'),
(16, 2, 'confirmed', 'Order confirmed and payment processed', 'Warehouse A', 'Items being prepared', 1, '2025-10-19 15:20:00'),
(17, 2, 'shipped', 'Order shipped via express delivery', 'Distribution Center', 'Tracking number: TRK1760894138', 1, '2025-10-20 07:30:00'),
(18, 2, 'delivered', 'Package delivered successfully', 'Kigali, Rwanda', 'Signed by recipient', 1, '2025-10-22 12:15:00'),
(19, 23, 'confirmed', 'Product \"Web Development Books\" status updated to confirmed by seller', 'Seller System', NULL, 1, '2025-11-01 17:43:09'),
(20, 23, 'confirmed', 'Product \"Web Development Books\" status updated to confirmed by seller', 'Seller System', NULL, 1, '2025-11-01 17:43:13'),
(21, 23, 'confirmed', 'Product \"Web Development Books\" status updated to confirmed by seller', 'Seller System', NULL, 1, '2025-11-01 17:43:25'),
(22, 23, 'confirmed', 'Product \"Web Development Books\" status updated to confirmed by seller', 'Seller System', NULL, 1, '2025-11-01 17:44:18'),
(23, 6, 'confirmed', 'Product \"Web Development Books\" status updated to confirmed by seller', 'Seller System', NULL, 1, '2025-11-01 17:45:10'),
(24, 24, 'delivered', 'All items in order have been delivered', 'System', NULL, 1, '2025-11-02 14:33:05'),
(25, 23, 'delivered', 'Order automatically marked as delivered - all items delivered', 'System', NULL, 1, '2025-11-02 14:35:07'),
(26, 2, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(27, 3, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(28, 4, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(29, 6, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(30, 7, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(31, 9, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(32, 11, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(33, 13, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(34, 16, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(35, 17, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(36, 19, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(37, 23, 'delivered', 'Order status corrected to delivered during system maintenance', 'System', NULL, 1, '2025-11-02 14:35:36'),
(38, 25, 'cancelled', 'Order cancelled by customer', 'Warehouse', 'i dont want this products', 1, '2025-11-17 17:58:25'),
(39, 22, 'cancelled', 'Order cancelled by customer', 'Warehouse', 'bhghhjn', 1, '2025-11-17 17:59:24'),
(40, 21, 'cancelled', 'Order cancelled by customer', 'Warehouse', 'No reason provided', 1, '2025-11-17 18:02:07'),
(41, 26, 'delivered', 'All items in order have been delivered', 'System', NULL, 1, '2025-11-25 11:37:48'),
(42, 11, 'delivered', 'All items in order have been delivered', 'System', NULL, 1, '2025-11-25 12:02:46'),
(43, 28, 'delivered', 'All items in order have been delivered', 'System', NULL, 1, '2025-12-01 17:34:36'),
(44, 31, 'cancelled', 'Order cancelled by customer', 'Warehouse', 'i dont need', 1, '2025-12-02 17:22:25'),
(45, 33, 'confirmed', 'Payment initiated via momo', 'Payment System', NULL, 1, '2025-12-04 11:40:24');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','seller','customer') DEFAULT 'customer',
  `is_approved` tinyint(1) DEFAULT 1,
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `is_approved`, `profile_picture`, `created_at`, `updated_at`) VALUES
(1, 'testuser', 'test@example.com', '$2b$10$ZnT4Res2zdgSdMm4cW3AQOrM.nxd.8.yOzht65zDu/HKi5bXMr3AW', 'admin', 1, '/uploads/profiles/profile_1_1761848069248.jpg', '2025-10-16 08:14:10', '2025-12-06 13:24:05'),
(2, 'testseller', 'testseller@shopeasy.com', '$2a$10$8K1p/a0dRL1//uJ7J4d.duB6.9S7C0Vc0uK8JxYkZzX8vY8Z8Z8Z8', 'seller', 1, NULL, '2025-10-16 08:28:11', '2025-10-16 08:38:11'),
(3, 'customer1', 'customer1@shopeasy.com', '$2a$10$8K1p/a0dRL1//uJ7J4d.duB6.9S7C0Vc0uK8JxYkZzX8vY8Z8Z8Z8', 'customer', 1, NULL, '2025-10-16 08:28:11', '2025-10-16 08:28:11'),
(4, 'tech_gadgets', 'tech@gadgets.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'seller', 1, NULL, '2025-10-18 15:05:02', '2025-10-18 15:05:02'),
(5, 'fashion_store', 'fashion@store.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'seller', 1, NULL, '2025-10-18 15:05:02', '2025-10-29 13:25:01'),
(6, 'home_essentials', 'home@essentials.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'seller', 1, NULL, '2025-10-18 15:05:02', '2025-10-18 15:05:02'),
(7, 'john_doe', 'john.doe@email.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'customer', 1, NULL, '2024-01-15 06:00:00', '2025-10-26 20:37:20'),
(8, 'sarah_wilson', 'sarah.wilson@email.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'customer', 1, NULL, '2024-02-20 06:00:00', '2025-10-26 20:37:20'),
(9, 'mike_johnson', 'mike.johnson@email.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'customer', 1, NULL, '2024-03-10 06:00:00', '2025-10-26 20:37:20'),
(10, 'lisa_brown', 'lisa.brown@email.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'customer', 1, NULL, '2024-04-05 06:00:00', '2025-10-26 20:37:20'),
(11, 'david_smith', 'david.smith@email.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'customer', 1, NULL, '2024-05-12 06:00:00', '2025-10-26 20:37:20'),
(12, 'emily_clark', 'emily.clark@email.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'seller', 1, '/uploads/profiles/profile_12_1763545912806.jpg', '2024-06-18 06:00:00', '2025-11-19 09:52:39'),
(13, 'robert_wilson', 'robert.wilson@email.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'customer', 1, NULL, '2024-07-22 06:00:00', '2025-10-26 20:37:20'),
(14, 'jennifer_lee', 'jennifer.lee@email.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'customer', 1, NULL, '2024-08-30 06:00:00', '2025-10-26 20:37:20'),
(15, 'kevin_martin', 'kevin.martin@email.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'customer', 1, NULL, '2024-09-14 06:00:00', '2025-10-26 20:37:20'),
(16, 'amanda_taylor', 'amanda.taylor@email.com', '$2b$10$nvfgtlsM/iSPdBac3WNnJOA1vjL/NUcfKcdxoFcwXOH4dDEYad.0m', 'customer', 1, NULL, '2024-10-08 06:00:00', '2025-10-26 20:37:20');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(1, 1, 5, '2025-10-16 09:10:01'),
(2, 1, 2, '2025-10-16 09:35:28'),
(5, 1, 9, '2025-10-23 20:46:55'),
(6, 1, 12, '2025-10-23 20:46:57'),
(8, 1, 8, '2025-10-23 20:47:10'),
(10, 1, 4, '2025-10-23 20:47:28'),
(11, 1, 11, '2025-10-25 14:51:01'),
(15, 7, 6, '2024-02-01 08:00:00'),
(16, 7, 12, '2024-02-05 12:30:00'),
(17, 8, 17, '2024-03-10 07:15:00'),
(19, 9, 9, '2024-04-20 09:20:00'),
(20, 9, 11, '2024-04-25 11:10:00'),
(22, 10, 25, '2024-06-05 06:50:00'),
(23, 11, 3, '2024-07-10 10:25:00'),
(24, 11, 16, '2024-07-15 12:40:00'),
(25, 12, 7, '2024-08-20 08:30:00'),
(26, 12, 8, '2024-08-25 15:20:00'),
(27, 13, 21, '2024-09-10 07:45:00'),
(28, 13, 22, '2024-09-15 09:55:00'),
(29, 14, 29, '2024-10-20 11:25:00'),
(30, 14, 31, '2024-10-25 13:35:00'),
(32, 1, 17, '2025-10-26 20:53:17'),
(33, 1, 13, '2025-10-26 20:53:28'),
(34, 1, 6, '2025-10-27 12:14:15'),
(38, 1, 7, '2025-10-30 06:33:30'),
(42, 12, 9, '2025-11-19 09:51:05'),
(43, 1, 32, '2025-11-30 12:01:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `category_suggestions`
--
ALTER TABLE `category_suggestions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `suggested_by` (`suggested_by`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `delivery_attempts`
--
ALTER TABLE `delivery_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tracking_id` (`tracking_id`);

--
-- Indexes for table `delivery_proofs`
--
ALTER TABLE `delivery_proofs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `tracking_id` (`tracking_id`),
  ADD KEY `verified_by` (`verified_by`);

--
-- Indexes for table `delivery_tracking`
--
ALTER TABLE `delivery_tracking`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tracking_number` (`tracking_number`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_orders_coupons` (`coupon_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_order_items_seller` (`seller_id`,`status`),
  ADD KEY `idx_order_items_status` (`status`);

--
-- Indexes for table `pawapay_webhook_logs`
--
ALTER TABLE `pawapay_webhook_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `merchant_reference` (`merchant_reference`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_merchant_reference` (`merchant_reference`),
  ADD KEY `idx_transaction_id` (`transaction_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `moderated_by` (`moderated_by`);

--
-- Indexes for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `tracking_history`
--
ALTER TABLE `tracking_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `category_suggestions`
--
ALTER TABLE `category_suggestions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `delivery_attempts`
--
ALTER TABLE `delivery_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_proofs`
--
ALTER TABLE `delivery_proofs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_tracking`
--
ALTER TABLE `delivery_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `pawapay_webhook_logs`
--
ALTER TABLE `pawapay_webhook_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `stock_history`
--
ALTER TABLE `stock_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `tracking_history`
--
ALTER TABLE `tracking_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `category_suggestions`
--
ALTER TABLE `category_suggestions`
  ADD CONSTRAINT `category_suggestions_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `category_suggestions_ibfk_2` FOREIGN KEY (`suggested_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `delivery_attempts`
--
ALTER TABLE `delivery_attempts`
  ADD CONSTRAINT `delivery_attempts_ibfk_1` FOREIGN KEY (`tracking_id`) REFERENCES `delivery_tracking` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `delivery_proofs`
--
ALTER TABLE `delivery_proofs`
  ADD CONSTRAINT `delivery_proofs_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `delivery_proofs_ibfk_2` FOREIGN KEY (`tracking_id`) REFERENCES `delivery_tracking` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `delivery_proofs_ibfk_3` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `delivery_tracking`
--
ALTER TABLE `delivery_tracking`
  ADD CONSTRAINT `delivery_tracking_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`),
  ADD CONSTRAINT `fk_orders_coupons` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`moderated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD CONSTRAINT `stock_history_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_history_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tracking_history`
--
ALTER TABLE `tracking_history`
  ADD CONSTRAINT `tracking_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tracking_history_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
