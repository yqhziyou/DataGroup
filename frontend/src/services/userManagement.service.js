import api from './api';

export const userManagementService = {
    // 更新用户邮箱
    updateUserEmail: (userId, newEmail) => {
        return api.put(`/user/${userId}/email`, { newEmail });
    },

    // 添加交易
    addTransaction: (data) => {
        return api.post('/transaction', data);
    },

    // 获取用户交易数量
    getUserTransactionCount: (userId) => {
        return api.get(`/user/${userId}/transactions/count`);
    },

    // 计算保护性看跌期权
    calculateProtectivePut: (data) => {
        return api.post('/calculate/protective-put', data);
    },

    // 计算备兑看涨期权
    calculateCoveredCall: (data) => {
        return api.post('/calculate/covered-call', data);
    },
};