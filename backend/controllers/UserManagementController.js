const UserManagementModel = require('../models/UserManagementModel');
const { validationResult } = require('express-validator');

const UserManagementController = {
    updateUserEmail: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { userId } = req.params;
            const { newEmail } = req.body;

            await UserManagementModel.updateUserEmail(userId, newEmail);

            res.json({
                success: true,
                message: 'Email updated successfully'
            });
        } catch (error) {
            console.error('Error updating email:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    },

    addTransaction: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { userId, tradeTypeId, stockSymbol, quantity, price } = req.body;

            await UserManagementModel.addTransaction(
                userId,
                tradeTypeId,
                stockSymbol,
                quantity,
                price
            );

            res.json({
                success: true,
                message: 'Transaction added successfully'
            });
        } catch (error) {
            console.error('Error adding transaction:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    },

    getUserTransactionCount: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { userId } = req.params;
            const count = await UserManagementModel.getUserTransactionCount(userId);

            res.json({
                success: true,
                count: count
            });
        } catch (error) {
            console.error('Error getting transaction count:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    },

    calculateProtectivePut: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { purchasePrice, quantity, optionPremium } = req.body;
            const value = await UserManagementModel.calculateProtectivePut(
                purchasePrice,
                quantity,
                optionPremium
            );

            res.json({
                success: true,
                value: value
            });
        } catch (error) {
            console.error('Error calculating protective put:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    },

    calculateCoveredCall: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { purchasePrice, quantity, optionPremium } = req.body;
            const value = await UserManagementModel.calculateCoveredCall(
                purchasePrice,
                quantity,
                optionPremium
            );

            res.json({
                success: true,
                value: value
            });
        } catch (error) {
            console.error('Error calculating covered call:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
};

module.exports = UserManagementController;