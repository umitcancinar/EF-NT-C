const db = require('./db');

const initDB = async () => {
  try {
    // Users table with finance/e-commerce fields
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        full_name VARCHAR(100),
        company_name VARCHAR(100),
        sector VARCHAR(50),
        country VARCHAR(50),
        city VARCHAR(50),
        capital_range VARCHAR(30),
        experience VARCHAR(20),
        profile_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // AI reports table
    await db.query(`
      CREATE TABLE IF NOT EXISTS ai_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        input_data JSONB,
        result TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Expenses tracking
    await db.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(50),
        description TEXT,
        amount DECIMAL(12,2),
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Salary records
    await db.query(`
      CREATE TABLE IF NOT EXISTS salary_records (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        employee_name VARCHAR(100),
        gross_salary DECIMAL(12,2),
        net_salary DECIMAL(12,2),
        sgk_premium DECIMAL(12,2),
        tax DECIMAL(12,2),
        month VARCHAR(7),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Chat history
    await db.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(10) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure new columns exist in users table (migration-safe)
    const cols = [
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(100)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(100)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS sector VARCHAR(50)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(50)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(50)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS capital_range VARCHAR(30)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS experience VARCHAR(20)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE"
    ];
    for (const q of cols) { await db.query(q); }

    console.log('✅ EFİNTİC database tables initialized successfully.');
  } catch (err) {
    console.error('❌ Error initializing database tables:', err);
  }
};

module.exports = initDB;
