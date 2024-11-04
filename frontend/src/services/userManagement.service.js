import api from './api';

export const userManagementService = {
    // Update user email
    updateUserEmail: (userId, newEmail) => {
        return api.put(`/user/${userId}/email`, { newEmail });
    },

    // Add transaction
    addTransaction: (data) => {
        return api.post('/transaction', data);
    },

    // Get user transaction count
    getUserTransactionCount: (userId) => {
        return api.get(`/user/${userId}/transactions/count`);
    },

    // Calculate protective put
    calculateProtectivePut: (data) => {
        return api.post('/calculate/protective-put', data);
    },

    // Calculate covered call
    calculateCoveredCall: (data) => {
        return api.post('/calculate/covered-call', data);
    },
};