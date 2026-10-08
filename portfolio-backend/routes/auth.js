const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Admin (Used to create your initial admin account)
router.post('/register', async (req, res) => {
  try {
    // Check if an admin already exists to lock down public registration
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Admin user already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ id: savedUser._id, email: savedUser.email, message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Admin API (Generates JWT)
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Create and assign a token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'secretKey', 
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      email: user.email, 
      message: 'Login successful' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;