import express from 'express';
import { generateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Simple in-memory user storage untuk testing
let users = [];

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    console.log('📝 Register attempt:', { name, email, phone });

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Nama, email, dan password harus diisi' 
      });
    }

    // Check if user exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User sudah terdaftar' 
      });
    }

    // Create simple user object
    const user = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      password: password, // Dalam production, harus di-hash
      createdAt: new Date()
    };

    users.push(user);

    console.log('✅ User registered:', user.email);
    console.log('📊 Total users:', users.length);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user.id)
      }
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error: ' + error.message 
    });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', { email });
    console.log('📊 Available users:', users.map(u => u.email));

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password harus diisi'
      });
    }

    // Find user
    const user = users.find(user => user.email === email);

    if (user && user.password === password) {
      console.log('✅ Login successful:', user.email);
      
      res.json({
        success: true,
        message: 'Login berhasil',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          token: generateToken(user.id)
        }
      });
    } else {
      console.log('❌ Login failed: Invalid credentials');
      res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error: ' + error.message 
    });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    console.log('🔍 Profile request for user:', req.user);
    
    const user = users.find(user => user.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

export default router;
