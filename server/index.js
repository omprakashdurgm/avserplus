import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';

// Import middleware
import { optionalAuth } from './middleware/auth.js';

// Import routes
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import adminsRouter from './routes/admins.js';
import vacanciesRouter from './routes/vacancies.js';
import applicationsRouter from './routes/applications.js';
import notificationsRouter from './routes/notifications.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================

// CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
    credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT NOW()');
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
});

// Root endpoint - API documentation
app.get('/', (req, res) => {
    res.json({
        name: 'AVSER+ Recruitment Portal API',
        version: '1.0.0',
        description: 'Aspirant Verification, Screening, Evaluation & Recruitment',
        endpoints: {
            health: 'GET /health',
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                adminLogin: 'POST /api/auth/admin-login',
                refresh: 'POST /api/auth/refresh'
            },
            users: 'GET /api/users',
            admins: 'GET /api/admins',
            vacancies: 'GET /api/vacancies',
            applications: 'GET /api/applications',
            notifications: 'GET /api/notifications'
        },
        documentation: 'See README.md for full API documentation'
    });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/vacancies', vacanciesRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/notifications', notificationsRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Initialize database connection and start server
const startServer = async () => {
    try {
        // Test database connection
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection established');

        // Start server
        app.listen(PORT, () => {
            console.log('');
            console.log('═══════════════════════════════════════════════════════════');
            console.log('  🚀 AVSER+ Recruitment Portal API');
            console.log('═══════════════════════════════════════════════════════════');
            console.log(`  📡 Server: http://localhost:${PORT}`);
            console.log(`  🗄️  Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
            console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log('═══════════════════════════════════════════════════════════');
            console.log('');
            console.log('  📋 Available Endpoints:');
            console.log('  ├─ GET  /health');
            console.log('  ├─ POST /api/auth/register');
            console.log('  ├─ POST /api/auth/login');
            console.log('  ├─ POST /api/auth/admin-login');
            console.log('  ├─ GET  /api/users');
            console.log('  ├─ GET  /api/admins');
            console.log('  ├─ GET  /api/vacancies');
            console.log('  ├─ GET  /api/applications');
            console.log('  └─ GET  /api/notifications');
            console.log('');
            console.log('  Press Ctrl+C to stop');
            console.log('═══════════════════════════════════════════════════════════');
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        console.error('');
        console.error('Please ensure:');
        console.error('  1. PostgreSQL is running');
        console.error('  2. Database credentials in .env are correct');
        console.error('  3. Database "avserplus" exists');
        console.error('');
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await pool.end();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    await pool.end();
    process.exit(0);
});

// Start the server
startServer();
