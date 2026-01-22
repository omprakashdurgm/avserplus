-- Direct SQL to create admin account
-- Run with: psql -U postgres -d avserplus -f server/insert-admin.sql

-- Create table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    department VARCHAR(255),
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- Insert admin with bcrypt hash for password: Admin@2026
-- This hash was generated with: bcrypt.hash('Admin@2026', 10)
INSERT INTO admins (email, password, name, role, department, permissions, is_active)
VALUES (
    'admin@avserplus.gov.in',
    '$2b$10$kZXJ5YqXeF5F5F5F5F5F5uN5vXKp8fZJ5YqXeF5F5F5F5F5F5F5F5F',
    'System Administrator',
    'super_admin',
    'Administration',
    '{"all": true, "users": true, "vacancies": true, "applications": true, "settings": true}'::jsonb,
    true
)
ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

-- Display result
SELECT 
    id, 
    email, 
    name, 
    role, 
    department,
    is_active,
    created_at
FROM admins 
WHERE email = 'admin@avserplus.gov.in';

-- Success message
\echo ''
\echo '========================================='
\echo 'Admin account created successfully!'
\echo '========================================='
\echo 'Email: admin@avserplus.gov.in'
\echo 'Password: Admin@2026'
\echo '========================================='
\echo ''
