import bcrypt from 'bcrypt';
import { pool } from '../db.js';

const SALT_ROUNDS = 10;

/**
 * Generate unique registration number for users
 * Format: AR01AA0001
 * AR = AVSER Recruitment prefix
 * 01 = Number part (01-99)
 * AA = Letter part (AA-ZZ)
 * 0001 = Sequence (0001-9999)
 */
export async function generateRegistrationNumber() {
    try {
        const result = await pool.query(
            'SELECT registration_number FROM users ORDER BY id DESC LIMIT 1'
        );

        let lastRegNumber = result.rows.length > 0 ? result.rows[0].registration_number : null;

        if (!lastRegNumber) {
            return 'AR01AA0001';
        }

        let numberPart = parseInt(lastRegNumber.substring(2, 4));
        let letterPart = lastRegNumber.substring(4, 6);
        let sequencePart = parseInt(lastRegNumber.substring(6, 10));

        sequencePart++;

        if (sequencePart > 9999) {
            sequencePart = 1;
            letterPart = incrementLetters(letterPart);
            if (letterPart === 'AA') {
                numberPart++;
                if (numberPart > 99) {
                    throw new Error('Registration capacity exceeded');
                }
            }
        }

        return 'AR' + String(numberPart).padStart(2, '0') +
            letterPart +
            String(sequencePart).padStart(4, '0');
    } catch (error) {
        throw new Error('Failed to generate registration number: ' + error.message);
    }
}

/**
 * Increment letter combination (AA -> AB -> ... -> ZZ)
 */
function incrementLetters(letters) {
    let first = letters[0];
    let second = letters[1];

    if (second === 'Z') {
        second = 'A';
        first = first === 'Z' ? 'A' : String.fromCharCode(first.charCodeAt(0) + 1);
    } else {
        second = String.fromCharCode(second.charCodeAt(0) + 1);
    }

    return first + second;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

/**
 * Format user data for response (remove sensitive fields)
 */
export function formatUserResponse(user) {
    const { password, password_hash, ...userData } = user;
    return userData;
}

/**
 * Format admin data for response (remove sensitive fields)
 */
export function formatAdminResponse(admin) {
    const { password, password_hash, ...adminData } = admin;
    return adminData;
}

/**
 * Generate random string for tokens
 */
export function generateRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Validate Indian phone number
 */
export function isValidIndianPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone) {
    return phone.replace(/\D/g, '');
}

/**
 * Calculate pagination offset
 */
export function getPaginationParams(page = 1, limit = 50) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const offset = (pageNum - 1) * limitNum;

    return {
        limit: limitNum,
        offset: offset,
        page: pageNum
    };
}
