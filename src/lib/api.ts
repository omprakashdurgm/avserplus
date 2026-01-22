// API Client for AVSER+ Recruitment Portal
// Centralized HTTP client for making API requests to the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Generic API request function
 */
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        };
    }
}

// ============================================================
// USERS API
// ============================================================

export const usersApi = {
    getAll: (params?: { category?: string; gender?: string; is_verified?: boolean }) => {
        const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
        return apiRequest(`/api/users${queryString}`);
    },

    getById: (id: number) => apiRequest(`/api/users/${id}`),

    create: (userData: {
        email: string;
        password: string;
        name: string;
        mobile?: string;
        date_of_birth?: string;
        category?: string;
        gender?: string;
    }) =>
        apiRequest('/api/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

    update: (id: number, userData: Partial<{
        name: string;
        mobile: string;
        date_of_birth: string;
        category: string;
        gender: string;
        profile_picture: string;
    }>) =>
        apiRequest(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        }),

    verifyEmail: (id: number) =>
        apiRequest(`/api/users/${id}/verify-email`, { method: 'PUT' }),

    verifyMobile: (id: number) =>
        apiRequest(`/api/users/${id}/verify-mobile`, { method: 'PUT' }),

    updateLastLogin: (id: number) =>
        apiRequest(`/api/users/${id}/last-login`, { method: 'PUT' }),

    delete: (id: number) =>
        apiRequest(`/api/users/${id}`, { method: 'DELETE' }),
};

// ============================================================
// ADMINS API
// ============================================================

export const adminsApi = {
    getAll: (params?: { role?: string; is_active?: boolean }) => {
        const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
        return apiRequest(`/api/admins${queryString}`);
    },

    getById: (id: number) => apiRequest(`/api/admins/${id}`),

    create: (adminData: {
        email: string;
        password: string;
        name: string;
        role?: string;
        department?: string;
        permissions?: any;
    }) =>
        apiRequest('/api/admins', {
            method: 'POST',
            body: JSON.stringify(adminData),
        }),

    update: (id: number, adminData: Partial<{
        name: string;
        role: string;
        department: string;
        permissions: any;
        is_active: boolean;
    }>) =>
        apiRequest(`/api/admins/${id}`, {
            method: 'PUT',
            body: JSON.stringify(adminData),
        }),

    updateLastLogin: (id: number) =>
        apiRequest(`/api/admins/${id}/last-login`, { method: 'PUT' }),

    delete: (id: number) =>
        apiRequest(`/api/admins/${id}`, { method: 'DELETE' }),
};

// ============================================================
// VACANCIES API
// ============================================================

export const vacanciesApi = {
    getAll: (params?: {
        status?: string;
        department?: string;
        employment_type?: string;
        is_featured?: boolean;
        search?: string;
    }) => {
        const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
        return apiRequest(`/api/vacancies${queryString}`);
    },

    getActive: () => apiRequest('/api/vacancies/public/active'),

    getById: (id: number) => apiRequest(`/api/vacancies/${id}`),

    getByCode: (vacancyId: string) => apiRequest(`/api/vacancies/code/${vacancyId}`),

    create: (vacancyData: any) =>
        apiRequest('/api/vacancies', {
            method: 'POST',
            body: JSON.stringify(vacancyData),
        }),

    update: (id: number, vacancyData: any) =>
        apiRequest(`/api/vacancies/${id}`, {
            method: 'PUT',
            body: JSON.stringify(vacancyData),
        }),

    updateStatus: (id: number, status: string) =>
        apiRequest(`/api/vacancies/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        }),

    delete: (id: number) =>
        apiRequest(`/api/vacancies/${id}`, { method: 'DELETE' }),

    getStats: (id: number) => apiRequest(`/api/vacancies/${id}/stats`),
};

// ============================================================
// APPLICATIONS API
// ============================================================

export const applicationsApi = {
    getAll: (params?: {
        user_id?: number;
        vacancy_id?: number;
        application_status?: string;
        verification_status?: string;
        is_shortlisted?: boolean;
        is_selected?: boolean;
    }) => {
        const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
        return apiRequest(`/api/applications${queryString}`);
    },

    getById: (id: number) => apiRequest(`/api/applications/${id}`),

    create: (applicationData: {
        user_id: number;
        vacancy_id: number;
        personal_details?: any;
        contact_info?: any;
        qualifications?: any;
        experience?: any;
        documents?: any;
        payment_amount?: number;
        ip_address?: string;
    }) =>
        apiRequest('/api/applications', {
            method: 'POST',
            body: JSON.stringify(applicationData),
        }),

    updateStatus: (id: number, statusData: {
        application_status?: string;
        current_stage?: string;
        remarks?: string;
        admin_id?: number;
    }) =>
        apiRequest(`/api/applications/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify(statusData),
        }),

    verify: (id: number, verificationData: {
        verification_status: string;
        verified_by: number;
        verification_remarks?: string;
        is_eligible?: boolean;
        eligibility_remarks?: string;
    }) =>
        apiRequest(`/api/applications/${id}/verify`, {
            method: 'PUT',
            body: JSON.stringify(verificationData),
        }),

    updatePayment: (id: number, paymentData: {
        payment_status: string;
        payment_details?: any;
    }) =>
        apiRequest(`/api/applications/${id}/payment`, {
            method: 'PUT',
            body: JSON.stringify(paymentData),
        }),

    delete: (id: number) =>
        apiRequest(`/api/applications/${id}`, { method: 'DELETE' }),

    getStats: (params?: { vacancy_id?: number }) => {
        const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
        return apiRequest(`/api/applications/stats/overview${queryString}`);
    },
};

// ============================================================
// NOTIFICATIONS API
// ============================================================

export const notificationsApi = {
    getUserNotifications: (userId: number, params?: {
        read?: boolean;
        category?: string;
        type?: string;
    }) => {
        const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
        return apiRequest(`/api/notifications/user/${userId}${queryString}`);
    },

    getUnreadCount: (userId: number) =>
        apiRequest(`/api/notifications/user/${userId}/unread-count`),

    create: (notificationData: {
        user_id: number;
        title: string;
        message: string;
        type?: string;
        category?: string;
        related_entity_type?: string;
        related_entity_id?: number;
        action_link?: string;
        action_text?: string;
        priority?: string;
        expires_at?: string;
    }) =>
        apiRequest('/api/notifications', {
            method: 'POST',
            body: JSON.stringify(notificationData),
        }),

    markAsRead: (id: number) =>
        apiRequest(`/api/notifications/${id}/read`, { method: 'PUT' }),

    markAllAsRead: (userId: number) =>
        apiRequest(`/api/notifications/user/${userId}/read-all`, { method: 'PUT' }),

    delete: (id: number) =>
        apiRequest(`/api/notifications/${id}`, { method: 'DELETE' }),
};

// ============================================================
// HEALTH CHECK
// ============================================================

export const healthCheck = () => apiRequest('/health');

// Export API base URL for direct use if needed
export { API_BASE_URL };
