import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'avser-plus-secret-key-2026';

/**
 * Verify JWT token from request headers
 * Attaches decoded user/admin data to req.user
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        req.user = decoded;
        next();
    });
};

/**
 * Require authenticated user (not admin)
 */
export const requireUser = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'This endpoint is for users only'
            });
        }
        next();
    });
};

/**
 * Require authenticated admin
 */
export const requireAdmin = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }
        next();
    });
};

/**
 * Require specific role
 * @param {string} role - Required role (e.g., 'super_admin', 'admin')
 */
export const requireRole = (role) => {
    return (req, res, next) => {
        authenticateToken(req, res, () => {
            if (!req.user.isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }

            if (req.user.role !== role) {
                return res.status(403).json({
                    success: false,
                    message: `Role '${role}' required`
                });
            }

            next();
        });
    };
};

/**
 * Optional authentication - attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (!err) {
            req.user = decoded;
        }
        next();
    });
};
