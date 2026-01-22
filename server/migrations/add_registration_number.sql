-- Migration: Add registration_number to users table
-- Run this after the main schema is created
-- Matches ACTUAL schema: users table with 'id', 'name', 'password', 'mobile'

-- Add registration_number column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS registration_number VARCHAR(20);

-- Add unique constraint
ALTER TABLE users
ADD CONSTRAINT users_registration_number_unique UNIQUE (registration_number);

-- Add index for registration_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_registration_number ON users(registration_number);

-- Update existing users with registration numbers (if any exist)
-- This will generate sequential registration numbers for existing users
DO $$
DECLARE
    user_record RECORD;
    counter INTEGER := 1;
    reg_num VARCHAR(20);
BEGIN
    FOR user_record IN SELECT id FROM users WHERE registration_number IS NULL ORDER BY id
    LOOP
        reg_num := 'AR01AA' || LPAD(counter::TEXT, 4, '0');
        UPDATE users SET registration_number = reg_num WHERE id = user_record.id;
        counter := counter + 1;
    END LOOP;
END $$;

-- Make registration_number NOT NULL after populating existing records
ALTER TABLE users 
ALTER COLUMN registration_number SET NOT NULL;

COMMENT ON COLUMN users.registration_number IS 'Auto-generated unique registration number in format AR01AA0001 (AVSER Recruitment)';

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name = 'registration_number';
