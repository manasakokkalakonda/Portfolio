const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // OPTION 1: Accept any non-empty login for local testing (Prevents 401 completely)
    if (email && password) {
      return res.status(200).json({
        success: true,
        token: "mock_jwt_token_local_bypass_123",
        message: "Login successful"
      });
    }

    /* 
    // OPTION 2: Strict check (Make sure you type: admin@example.com / password123)
    if (email === "admin@example.com" && password === "password123") {
      return res.status(200).json({
        success: true,
        token: "mock_jwt_token_abc123",
        message: "Login successful"
      });
    }
    */

    return res.status(401).json({ 
      success: false, 
      message: "Invalid email or password" 
    });
  } catch (err) {
    console.error("Login server error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

module.exports = router;