-- EIQUEKIES Cloudflare D1 (SQLite) Master Schema

-- 1. Table: Users (Owner, Staff, Agent)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('OWNER', 'STAFF', 'AGENT')) DEFAULT 'STAFF',
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: Customers
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    address TEXT,
    customer_type TEXT CHECK(customer_type IN ('WALK_IN', 'RETAIL', 'AGENT', 'DROPSHIP', 'WHOLESALE')) DEFAULT 'RETAIL',
    loyalty_points INTEGER DEFAULT 0,
    birthday DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: Inventory Items (Bahan & Packaging)
CREATE TABLE IF NOT EXISTS inventory_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT CHECK(category IN ('INGREDIENT', 'PACKAGING', 'DECORATION', 'OTHER')) NOT NULL,
    unit TEXT NOT NULL, -- e.g., kg, gram, pcs, box, meter
    current_stock REAL DEFAULT 0,
    min_stock_alert REAL DEFAULT 5,
    cost_per_unit REAL DEFAULT 0,
    expiry_date DATE,
    supplier TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: Stock Movements
CREATE TABLE IF NOT EXISTS stock_movements (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    type TEXT CHECK(type IN ('IN', 'OUT', 'ADJUSTMENT')) NOT NULL,
    quantity REAL NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

-- 5. Table: Recipes
CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT CHECK(category IN ('KEK', 'KUIH', 'DESSERT', 'OTHER')) NOT NULL,
    base_yield INTEGER DEFAULT 1, -- e.g., 1 cake (8 inch)
    prep_time_mins INTEGER DEFAULT 0,
    image_url TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table: Recipe Ingredients
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id TEXT PRIMARY KEY,
    recipe_id TEXT NOT NULL,
    inventory_item_id TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id)
);

-- 7. Table: Orders
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_id TEXT NOT NULL,
    order_type TEXT CHECK(order_type IN ('KEK', 'KUIH', 'DESSERT', 'OTHER')) NOT NULL,
    pricing_tier TEXT CHECK(pricing_tier IN ('WALK_IN', 'RETAIL', 'AGENT', 'DROPSHIP', 'WHOLESALE')) DEFAULT 'RETAIL',
    status TEXT CHECK(status IN ('PENDING', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED')) DEFAULT 'PENDING',
    
    -- Kewangan & Harga
    subtotal REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    voucher_code TEXT,
    shipping_fee REAL DEFAULT 0,
    additional_fee REAL DEFAULT 0, -- Topper / Edible Image
    total_cost REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    deposit_paid REAL DEFAULT 0,
    balance_due REAL DEFAULT 0,
    
    -- Tarikh
    pickup_date DATETIME,
    delivery_date DATETIME,
    
    -- Maklumat Tambahan
    notes TEXT,
    qr_code_hash TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 8. Table: Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    recipe_id TEXT,
    item_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

-- 9. Table: Finances (Pendapatan & Perbelanjaan)
CREATE TABLE IF NOT EXISTS finances (
    id TEXT PRIMARY KEY,
    type TEXT CHECK(type IN ('INCOME', 'EXPENSE')) NOT NULL,
    category TEXT NOT NULL, -- Sales, Ingredients, Packaging, Utility, Salary, Other
    amount REAL NOT NULL,
    payment_method TEXT DEFAULT 'CASH', -- Cash, Online Transfer, QR Pay
    reference_id TEXT, -- e.g., Order ID or Receipt No
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Table: Daily To-Do Checklist
CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT CHECK(status IN ('PENDING', 'COMPLETED')) DEFAULT 'PENDING',
    due_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. Table: Photo Gallery
CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    order_id TEXT,
    image_url TEXT NOT NULL,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);
