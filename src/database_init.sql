-- MySQL database initialization script for Maximo
-- Database: demoMaximo
-- Table: orders

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS demoMaximo;

-- Use the database
USE demoMaximo;

-- Drop table if it already exists
DROP TABLE IF EXISTS `orders`;

-- Create orders table
CREATE TABLE `orders` (
  `order_id` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `customer` varchar(200) DEFAULT NULL,
  `product_name` varchar(200) DEFAULT NULL,
  `product_code` varchar(50) DEFAULT NULL,
  `delivery_date` varchar(20) DEFAULT NULL,
  `quantity` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `comment` varchar(100) DEFAULT NULL
);

-- Display table structure
DESCRIBE orders;
