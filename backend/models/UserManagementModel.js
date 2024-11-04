const oracledb = require('oracledb');
const dbConfig = require('../config/database');

class UserManagementModel {
    async getConnection() {
        try {
            return await oracledb.getConnection(dbConfig);
        } catch (error) {
            throw new Error(`Database connection error: ${error.message}`);
        }
    }

    async updateUserEmail(userId, newEmail) {
        let connection;
        try {
            connection = await this.getConnection();

            await connection.execute(
                `BEGIN
                    user_management_pkg.update_user_email(:userId, :newEmail);
                END;`,
                {
                    userId: userId,
                    newEmail: newEmail
                }
            );

            await connection.commit();
            return { success: true };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.error('Error closing connection:', error);
                }
            }
        }
    }


    async addTransaction(userId, tradeTypeId, stockSymbol, quantity, price) {
        let connection;
        try {
            connection = await this.getConnection();

            await connection.execute(
                `BEGIN
           user_management_pkg.add_transaction(:userId, :tradeTypeId, :stockSymbol, :quantity, :price);
         END;`,
                {
                    userId: userId,
                    tradeTypeId: tradeTypeId,
                    stockSymbol: stockSymbol,
                    quantity: quantity,
                    price: price
                }
            );

            await connection.commit();
            return { success: true };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.error('Error closing connection:', error);
                }
            }
        }
    }

    async getUserTransactionCount(userId) {
        let connection;
        try {
            connection = await this.getConnection();

            const result = await connection.execute(
                `BEGIN
           :count := user_management_pkg.get_user_transaction_count(:userId);
         END;`,
                {
                    count: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    userId: userId
                }
            );

            return result.outBinds.count;
        } catch (error) {
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.error('Error closing connection:', error);
                }
            }
        }
    }

    async calculateProtectivePut(purchasePrice, quantity, optionPremium) {
        let connection;
        try {
            connection = await this.getConnection();

            const result = await connection.execute(
                `BEGIN
           :value := user_management_pkg.calculate_protective_put(:purchasePrice, :quantity, :optionPremium);
         END;`,
                {
                    value: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    purchasePrice: purchasePrice,
                    quantity: quantity,
                    optionPremium: optionPremium
                }
            );

            return result.outBinds.value;
        } catch (error) {
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.error('Error closing connection:', error);
                }
            }
        }
    }

    async calculateCoveredCall(purchasePrice, quantity, optionPremium) {
        let connection;
        try {
            connection = await this.getConnection();

            const result = await connection.execute(
                `BEGIN
           :value := user_management_pkg.calculate_covered_call(:purchasePrice, :quantity, :optionPremium);
         END;`,
                {
                    value: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    purchasePrice: purchasePrice,
                    quantity: quantity,
                    optionPremium: optionPremium
                }
            );

            return result.outBinds.value;
        } catch (error) {
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.error('Error closing connection:', error);
                }
            }
        }
    }
}

module.exports = new UserManagementModel();