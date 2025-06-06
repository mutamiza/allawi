-- استخدام قاعدة البيانات
USE investment_contracts;

-- إضافة مستخدمين تجريبيين
INSERT INTO users (id, username, fullName, email, passwordHash, role, permissions, status, lastLogin, createdAt)
VALUES
('U1001', 'admin', 'مدير النظام', 'admin@example.com', '$2a$10$XFE/UQEOEanIbpQ8S0CYR.mSeN1JQZPVN0nWjQg6MWHlS/1lVWEPS', 'مدير', 'read,write,delete,admin', 'نشط', NOW(), NOW()),
('U1002', 'manager', 'مدير العقود', 'manager@example.com', '$2a$10$XFE/UQEOEanIbpQ8S0CYR.mSeN1JQZPVN0nWjQg6MWHlS/1lVWEPS', 'مدير عقود', 'read,write', 'نشط', NOW(), NOW());

-- إضافة عقود تجريبية
INSERT INTO contracts (id, contractName, contractNumber, startDate, endDate, totalRentValue, facilitiesServiceFees, signageFees, rentPaymentPeriod, contractStatus, notes, createdAt, updatedAt, createdBy)
VALUES
('C1001', 'عقد استثمار المجمع التجاري الأول', 'INV-2024-001', '2024-01-01', '2026-12-31', 120000, 5000, 2000, 'شهري', 'نشط', 'عقد استثمار للمجمع التجاري الرئيسي', NOW(), NOW(), 'admin'),
('C1002', 'عقد استثمار المكاتب الإدارية', 'INV-2024-002', '2024-02-01', '2027-01-31', 180000, 7500, 3000, 'ربع سنوي', 'نشط', 'عقد استثمار للمكاتب الإدارية', NOW(), NOW(), 'admin'),
('C1003', 'عقد استثمار المحلات التجارية', 'INV-2024-003', '2024-03-01', '2025-02-28', 96000, 4000, 1500, 'شهري', 'منتهي قريباً', 'عقد استثمار للمحلات التجارية الصغيرة', NOW(), NOW(), 'admin');

-- إضافة دفعات تجريبية
INSERT INTO payments (id, contractId, type, amount, paymentDate, dueDate, status, paymentMethod, receiptNumber, notes, createdBy, createdAt, updatedAt)
VALUES
('PAY1001', 'C1001', 'rent', 10000, '2024-01-15', '2024-01-31', 'paid', 'تحويل بنكي', 'REC-001', 'دفعة إيجار شهر يناير', 'admin', NOW(), NOW()),
('PAY1002', 'C1001', 'rent', 10000, NULL, '2024-02-28', 'pending', NULL, NULL, 'دفعة إيجار شهر فبراير', 'admin', NOW(), NOW()),
('PAY1003', 'C1001', 'facilities', 5000, NULL, '2024-01-15', 'overdue', NULL, NULL, 'رسوم خدمات المرافق للربع الأول', 'admin', NOW(), NOW()),
('PAY1004', 'C1002', 'rent', 15000, '2024-02-10', '2024-02-28', 'paid', 'شيك', 'REC-002', 'دفعة إيجار شهر فبراير', 'admin', NOW(), NOW());

-- إضافة إعدادات النظام
INSERT INTO settings (settingKey, settingValue, description, updatedAt, updatedBy)
VALUES
('system_name', 'نظام إدارة عقود الاستثمار', 'اسم النظام', NOW(), 'admin'),
('notification_email', 'notifications@example.com', 'البريد الإلكتروني للإشعارات', NOW(), 'admin'),
('payment_reminder_days', '7', 'عدد أيام التذكير قبل موعد الدفع', NOW(), 'admin'),
('contract_expiry_reminder_days', '30', 'عدد أيام التذكير قبل انتهاء العقد', NOW(), 'admin');

-- إضافة قواعد تنبيهات
INSERT INTO notification_rules (id, ruleName, ruleType, conditions, actions, isActive, createdBy, createdAt, updatedAt)
VALUES
('NR1001', 'تنبيه انتهاء العقد', 'contract_expiry', '{"days_before": 30}', '{"send_email": true, "show_notification": true}', TRUE, 'admin', NOW(), NOW()),
('NR1002', 'تنبيه موعد الدفع', 'payment_due', '{"days_before": 7}', '{"send_email": true, "show_notification": true}', TRUE, 'admin', NOW(), NOW());
