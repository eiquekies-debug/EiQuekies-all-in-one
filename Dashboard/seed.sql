-- Seed Data untuk Pengguna (Admin/Owner & Staff)
INSERT INTO users (id, username, email, password_hash, full_name, role, phone)
VALUES 
('usr_1', 'admin', 'owner@eiquekies.my', 'scrypt_hashed_password_here', 'Eique Bakery Owner', 'OWNER', '60123456789'),
('usr_2', 'staff1', 'staff@eiquekies.my', 'scrypt_hashed_password_here', 'Siti Baker', 'STAFF', '60198765432');

-- Seed Data Pelanggan Contoh
INSERT INTO customers (id, name, phone, email, address, customer_type, loyalty_points, birthday, notes)
VALUES
('cust_1', 'Aina Rosli', '60171234567', 'aina@gmail.com', 'No 12, Jalan Bunga 3, KL', 'RETAIL', 50, '1995-08-15', 'Suka kek kurang manis'),
('cust_2', 'Agent Siti', '60189876543', 'sitiagent@gmail.com', 'Shah Alam, Selangor', 'AGENT', 200, '1992-03-20', 'Agent Kawasan Shah Alam');

-- Seed Data Inventori Bahan & Box
INSERT INTO inventory_items (id, name, category, unit, current_stock, min_stock_alert, cost_per_unit, expiry_date)
VALUES
('inv_1', 'Tepung Gandum Premium', 'INGREDIENT', 'kg', 25.0, 5.0, 3.50, '2026-12-31'),
('inv_2', 'Butter Anchor 250g', 'INGREDIENT', 'pcs', 40.0, 10.0, 11.80, '2026-10-15'),
('inv_3', 'Kotak Kek 8 Inch Premium', 'PACKAGING', 'pcs', 100.0, 20.0, 2.50, NULL),
('inv_4', 'Reben Pink Silk 1cm', 'PACKAGING', 'meter', 50.0, 10.0, 0.50, NULL);
