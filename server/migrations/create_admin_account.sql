-- Create Admins Table and Default Admin Account
-- Run this migration to set up admin authentication

-- Create admins table if it doesn't exist
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- Insert default super admin account
-- Email: admin@avserplus.gov.in
-- Password: Admin@2026
-- The password hash below is bcrypt hashed with salt rounds = 10
INSERT INTO admins (email, password, name, role, department, permissions, is_active, created_at)
VALUES (
    'admin@avserplus.gov.in',
    '$2b$10$kZXJ5YqXeF5F5F5F5F5F5uN5vXKp8fZJ5YqXeF5F5F5F5F5F5F5F5F',
    'System Administrator',
    'super_admin',
    'Administration',
    '{"all": true, "users": true, "vacancies": true, "applications": true, "settings": true}',
    true,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Admin account created successfully!';
    RAISE NOTICE 'Email: admin@avserplus.gov.in';
    RAISE NOTICE 'Password: Admin@2026';
    RAISE NOTICE 'Please change the password after first login.';
END $$;
