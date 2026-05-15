const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const user = require('../controllers/userController');

router.get('/profile', auth, user.getProfile);
router.put('/profile', auth, user.updateProfile);
router.put('/change-password', auth, user.changePassword);

// Expenses
router.get('/expenses', auth, user.getExpenses);
router.post('/expenses', auth, user.addExpense);
router.delete('/expenses/:id', auth, user.deleteExpense);

// Salaries
router.get('/salaries', auth, user.getSalaries);
router.post('/salaries', auth, user.addSalary);
router.delete('/salaries/:id', auth, user.deleteSalary);

module.exports = router;
