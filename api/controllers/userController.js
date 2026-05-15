const db = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, role, full_name, company_name, sector, country, city, capital_range, experience, profile_completed FROM users WHERE id = $1',
      [req.user.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, company_name, sector, country, city, capital_range, experience } = req.body;
    
    const result = await db.query(
      `UPDATE users SET 
        full_name = COALESCE($1, full_name),
        company_name = COALESCE($2, company_name),
        sector = COALESCE($3, sector),
        country = COALESCE($4, country),
        city = COALESCE($5, city),
        capital_range = COALESCE($6, capital_range),
        experience = COALESCE($7, experience),
        profile_completed = TRUE
      WHERE id = $8
      RETURNING id, username, email, role, full_name, company_name, sector, country, city, capital_range, experience, profile_completed`,
      [full_name, company_name, sector, country, city, capital_range, experience, req.user.userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { currentPassword, newPassword } = req.body;
    
    const userResult = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.userId]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user.userId]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error changing password' });
  }
};

// ─── Expenses CRUD ───
exports.getExpenses = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC LIMIT 50',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { category, description, amount, date } = req.body;
    const result = await db.query(
      'INSERT INTO expenses (user_id, category, description, amount, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.userId, category, description, amount, date || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error adding expense' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await db.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting expense' });
  }
};

// ─── Salary CRUD ───
exports.getSalaries = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM salary_records WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching salaries' });
  }
};

exports.addSalary = async (req, res) => {
  try {
    const { employee_name, gross_salary, net_salary, sgk_premium, tax, month } = req.body;
    const result = await db.query(
      'INSERT INTO salary_records (user_id, employee_name, gross_salary, net_salary, sgk_premium, tax, month) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.userId, employee_name, gross_salary, net_salary, sgk_premium, tax, month]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error adding salary record' });
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    await db.query('DELETE FROM salary_records WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting salary record' });
  }
};
