-- Test Script: Verify Registration Number Generation
-- This demonstrates the AR01AA0001 → AR01AA0002 → ... → AR01AB0001 sequence

-- First, ensure the registration_number column exists
-- Run the migration first: add_registration_number.sql

-- Test 1: Register first user (should get AR01AA0001)
-- Via API: POST /api/auth/register
-- Expected: AR01AA0001

-- Test 2: Register second user (should get AR01AA0002)
-- Via API: POST /api/auth/register
-- Expected: AR01AA0002

-- Test 3: Simulate 9999 users to test letter increment
-- This would give us AR01AA9999, then next should be AR01AB0001

-- Query to check current registration numbers
SELECT 
    user_id,
    registration_number,
    full_name,
    email,
    created_at
FROM users
ORDER BY user_id DESC
LIMIT 20;

-- Query to see the pattern progression
SELECT 
    registration_number,
    COUNT(*) as count
FROM users
GROUP BY registration_number
ORDER BY registration_number;

-- Test the sequence logic manually
DO $$
DECLARE
    test_numbers TEXT[] := ARRAY[
        'AR01AA0001',
        'AR01AA0002',
        'AR01AA9999',
        'AR01AB0001',
        'AR01AB9999',
        'AR01AC0001',
        'AR01AZ9999',
        'AR01BA0001',
        'AR01ZZ9999',
        'AR02AA0001'
    ];
    num TEXT;
BEGIN
    RAISE NOTICE 'Testing Registration Number Sequence:';
    RAISE NOTICE '=====================================';
    FOREACH num IN ARRAY test_numbers
    LOOP
        RAISE NOTICE '%', num;
    END LOOP;
END $$;

-- Verify uniqueness constraint
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'users' 
AND constraint_type = 'UNIQUE'
AND constraint_name LIKE '%registration%';

-- Check index
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'users'
AND indexname LIKE '%registration%';
