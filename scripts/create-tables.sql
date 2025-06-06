-- إنشاء قاعدة البيانات إذا لم تكن موجودة
CREATE DATABASE IF NOT EXISTS investment_contracts;

-- استخدام قاعدة البيانات
USE investment_contracts;

-- إنشاء جدول العقود
CREATE TABLE IF NOT EXISTS contracts (
  id VARCHAR(50) PRIMARY KEY,
  contractName VARCHAR(255) NOT NULL,
  contractNumber VARCHAR(50) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  totalRentValue DECIMAL(15, 2) NOT NULL,
  facilitiesServiceFees DECIMAL(15, 2) NOT NULL,
  signageFees DECIMAL(15, 2) NOT NULL,
  rentPaymentPeriod VARCHAR(50) NOT NULL,
  contractStatus VARCHAR(50) NOT NULL,
  notes TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  createdBy VARCHAR(50) NOT NULL,
  INDEX idx_contract_number (contractNumber),
  INDEX idx_contract_status (contractStatus)
);

-- إنشاء جدول الدفعات
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(50) PRIMARY KEY,
  contractId VARCHAR(50) NOT NULL,
  type ENUM('rent', 'facilities', 'signage') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  paymentDate DATE,
  dueDate DATE NOT NULL,
  status ENUM('paid', 'pending', 'overdue') NOT NULL,
  paymentMethod VARCHAR(100),
  receiptNumber VARCHAR(100),
  notes TEXT,
  createdBy VARCHAR(50) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (contractId) REFERENCES contracts(id) ON DELETE CASCADE,
  INDEX idx_contract_id (contractId),
  INDEX idx_payment_status (status),
  INDEX idx_payment_due_date (dueDate)
);

-- إنشاء جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  fullName VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  permissions TEXT NOT NULL,
  status VARCHAR(20) NOT NULL,
  lastLogin DATETIME,
  createdAt DATETIME NOT NULL,
  INDEX idx_username (username),
  INDEX idx_role (role),
  INDEX idx_status (status)
);

-- إنشاء جدول التنبيهات
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  contractId VARCHAR(50),
  priority VARCHAR(20) NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt DATETIME NOT NULL,
  userId VARCHAR(50),
  FOREIGN KEY (contractId) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notification_type (type),
  INDEX idx_notification_read (isRead)
);

-- إنشاء جدول الإعدادات
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  settingKey VARCHAR(100) NOT NULL UNIQUE,
  settingValue TEXT NOT NULL,
  description TEXT,
  updatedAt DATETIME NOT NULL,
  updatedBy VARCHAR(50) NOT NULL,
  INDEX idx_setting_key (settingKey)
);

-- إنشاء جدول سجل النشاطات
CREATE TABLE IF NOT EXISTS activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(50),
  action VARCHAR(100) NOT NULL,
  entityType VARCHAR(50) NOT NULL,
  entityId VARCHAR(50),
  details TEXT,
  ipAddress VARCHAR(50),
  createdAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_activity_action (action),
  INDEX idx_activity_entity (entityType, entityId),
  INDEX idx_activity_date (createdAt)
);

-- إنشاء جدول قواعد التنبيهات
CREATE TABLE IF NOT EXISTS notification_rules (
  id VARCHAR(50) PRIMARY KEY,
  ruleName VARCHAR(100) NOT NULL,
  ruleType VARCHAR(50) NOT NULL,
  conditions TEXT NOT NULL,
  actions TEXT NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdBy VARCHAR(50) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_rule_type (ruleType),
  INDEX idx_rule_active (isActive)
);
