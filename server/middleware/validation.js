/**
 * Request validation middleware
 */

/**
 * Validate registration data
 */
export const validateRegistration = (req, res, next) => {
    const { fullName, email, phone, password } = req.body;
    const errors = [];

    // Full name validation
    if (!fullName || fullName.trim().length < 2) {
        errors.push('Full name must be at least 2 characters');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Valid email is required');
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\D/g, ''))) {
        errors.push('Valid 10-digit phone number is required');
    }

    // Password validation
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

/**
 * Validate login data
 */
export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !email.trim()) {
        errors.push('Email is required');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

/**
 * Validate email format
 */
export const validateEmail = (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Valid email is required'
        });
    }

    next();
};

/**
 * Validate password strength
 */
export const validatePassword = (req, res, next) => {
    const { password } = req.body;
    const errors = [];

    if (!password) {
        errors.push('Password is required');
    } else {
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Password validation failed',
            errors
        });
    }

    next();
};

/**
 * Validate application data
 */
export const validateApplication = (req, res, next) => {
    const { vacancyId } = req.body;
    const errors = [];

    if (!vacancyId) {
        errors.push('Vacancy ID is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

/**
 * Validate vacancy data
 */
export const validateVacancy = (req, res, next) => {
    const { title, description } = req.body;
    const errors = [];

    if (!title || title.trim().length < 3) {
        errors.push('Title must be at least 3 characters');
    }

    if (!description || description.trim().length < 10) {
        errors.push('Description must be at least 10 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};
