const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const userExists = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role, profile_completed',
      [username, email, passwordHash]
    );

    const token = jwt.sign({ userId: newUser.rows[0].id, role: newUser.rows[0].role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.status(201).json({ user: newUser.rows[0], token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile_completed: user.profile_completed
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userResult = await db.query('SELECT id, username, email, role, profile_completed FROM users WHERE id = $1', [req.user.userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user: userResult.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred.' });
  }
};
