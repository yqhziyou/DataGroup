const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const userController = require('../controllers/UserManagementController');

// 添加调试日志
console.log('userController:', userController);
console.log('updateUserEmail method:', userController.updateUserEmail);

router.put('/user/:userId/email',
    [
        param('userId').isInt(),
        body('newEmail').isEmail()
    ],
    (req, res, next) => {
        try {
            return userController.updateUserEmail(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/transaction',
    [
        body('userId').isInt(),
        body('tradeTypeId').isInt(),
        body('stockSymbol').isString().trim().notEmpty(),
        body('quantity').isInt(),
        body('price').isFloat()
    ],
    (req, res, next) => {
        try {
            return userController.addTransaction(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/user/:userId/transactions/count',
    [
        param('userId').isInt()
    ],
    (req, res, next) => {
        try {
            return userController.getUserTransactionCount(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/calculate/protective-put',
    [
        body('purchasePrice').isFloat(),
        body('quantity').isInt(),
        body('optionPremium').isFloat()
    ],
    (req, res, next) => {
        try {
            return userController.calculateProtectivePut(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/calculate/covered-call',
    [
        body('purchasePrice').isFloat(),
        body('quantity').isInt(),
        body('optionPremium').isFloat()
    ],
    (req, res, next) => {
        try {
            return userController.calculateCoveredCall(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;