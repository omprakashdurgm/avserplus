-- Create database (run this separately if needed)
-- CREATE DATABASE avserplus;

-- Connect to avserplus database and run the following:

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'recruiter', 'candidate')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    profile_picture_url TEXT,
    resume_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vacancies Table
CREATE TABLE IF NOT EXISTS vacancies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    location VARCHAR(200),
    employment_type VARCHAR(50) CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
    experience_level VARCHAR(50) CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead')),
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    salary_currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'on-hold')),
    posted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    posted_date TIMESTAMP,
    closing_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    vacancy_id INTEGER NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under-review', 'shortlisted', 'interview-scheduled', 'rejected', 'accepted', 'withdrawn')),
    cover_letter TEXT,
    resume_url TEXT,
    additional_documents JSONB,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(vacancy_id, user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interview Schedules Table
CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    interviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    scheduled_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location VARCHAR(200),
    meeting_link TEXT,
    interview_type VARCHAR(50) CHECK (interview_type IN ('phone', 'video', 'in-person', 'technical', 'hr')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_vacancies_status ON vacancies(status);
CREATE INDEX IF NOT EXISTS idx_vacancies_department ON vacancies(department_id);
CREATE INDEX IF NOT EXISTS idx_applications_vacancy ON applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_interviews_application ON interviews(application_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vacancies_updated_at BEFORE UPDATE ON vacancies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
    ('Engineering', 'Software development and technical roles'),
    ('Human Resources', 'HR and recruitment team'),
    ('Marketing', 'Marketing and communications'),
    ('Sales', 'Sales and business development'),
    ('Finance', 'Finance and accounting')
ON CONFLICT (name) DO NOTHING;

-- Insert sample admin user (password: admin123 - you should hash this in production)
INSERT INTO users (email, password_hash, first_name, last_name, role, phone) VALUES
    ('admin@avserplus.com', '$2a$10$rKZHvEJzJZz5Z5Z5Z5Z5ZOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'Admin', 'User', 'admin', '+1234567890')
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE users IS 'Stores user information for candidates, recruiters, and admins';
COMMENT ON TABLE vacancies IS 'Job vacancy postings';
COMMENT ON TABLE applications IS 'Job applications submitted by candidates';
COMMENT ON TABLE interviews IS 'Interview schedules and feedback';
COMMENT ON TABLE departments IS 'Organization departments';
