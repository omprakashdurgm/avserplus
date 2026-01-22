import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';
import {
    generateRegistrationNumber,
    hashPassword,
    comparePassword,
    formatUserResponse,
    formatAdminResponse
} from '../utils/helpers.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'avser-plus-secret-key-2026';

// ============================================
// USER AUTHENTICATION
// ============================================

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistration, async (req, res) => {
    const client = await pool.connect();

    try {
        const { fullName, email, phone, password } = req.body;

        await client.query('BEGIN');

        // Check if user already exists
        const existing = await client.query(
            'SELECT COUNT(*) as count FROM users WHERE email = $1 OR mobile = $2',
            [email.trim(), phone.replace(/\D/g, '')]
        );

        if (parseInt(existing.rows[0].count) > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'User with this email or mobile already exists'
            });
        }

        // Generate registration number and hash password
        const registrationNumber = await generateRegistrationNumber();
        const hashedPassword = await hashPassword(password);

        // Insert new user
        const result = await client.query(
            `INSERT INTO users (registration_number, name, email, mobile, password, is_verified, email_verified, mobile_verified, created_at) 
             VALUES ($1, $2, $3, $4, $5, FALSE, FALSE, FALSE, NOW()) 
             RETURNING id, registration_number, name, email, mobile, created_at`,
            [registrationNumber, fullName.trim(), email.trim(), phone.replace(/\D/g, ''), hashedPassword]
        );

        const newUser = result.rows[0];
        await client.query('COMMIT');

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: newUser.id,
                email: newUser.email,
                registrationNumber: newUser.registration_number,
                isAdmin: false
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: formatUserResponse(newUser),
                token
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    } finally {
        client.release();
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = result.rows[0];

        // Verify password
        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                registrationNumber: user.registration_number,
                isAdmin: false
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: formatUserResponse(user),
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// ============================================
// ADMIN AUTHENTICATION
// ============================================

/**
 * @route   POST /api/auth/admin-login
 * @desc    Login admin
 * @access  Public
 */
router.post('/admin-login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin
        const result = await pool.query(
            'SELECT * FROM admins WHERE email = $1',
            [email.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        const admin = result.rows[0];

        // Check if admin is active
        if (!admin.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Admin account is inactive'
            });
        }

        // Verify password
        const isValid = await comparePassword(password, admin.password);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Update last login
        await pool.query('UPDATE admins SET last_login = NOW() WHERE id = $1', [admin.id]);

        // Generate JWT token
        const token = jwt.sign(
            {
                adminId: admin.id,
                email: admin.email,
                role: admin.role,
                isAdmin: true
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Admin login successful',
            data: {
                admin: formatAdminResponse(admin),
                token
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during admin login'
        });
    }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Public
 */
router.post('/refresh', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // Generate new token
        const newToken = jwt.sign(
            {
                userId: decoded.userId,
                adminId: decoded.adminId,
                email: decoded.email,
                registrationNumber: decoded.registrationNumber,
                role: decoded.role,
                isAdmin: decoded.isAdmin
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: { token: newToken }
        });
    });
});

export default router;
