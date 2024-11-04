import { useState } from 'react';
import { userManagementService } from '../../../services/userManagement.service';

export const TestPanel = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleApiCall = async (apiFunc, data) => {
        setLoading(true);
        try {
            const response = await apiFunc(data);
            setResult(JSON.stringify(response, null, 2));
        } catch (error) {
            setResult(JSON.stringify(error.response?.data || error.message, null, 2));
        } finally {
            setLoading(false);
        }
    };

    const testCases = [
        {
            name: '测试更新邮箱',
            action: () => handleApiCall(
                () => userManagementService.updateUserEmail(1, 'test@example.com')
            ),
            color: '#3B82F6'
        },
        {
            name: '测试添加交易',
            action: () => handleApiCall(
                () => userManagementService.addTransaction({
                    userId: 1,
                    tradeTypeId: 1,
                    stockSymbol: 'AAPL',
                    quantity: 100,
                    price: 150.50
                })
            ),
            color: '#10B981'
        },
        {
            name: '测试获取交易数量',
            action: () => handleApiCall(
                () => userManagementService.getUserTransactionCount(1)
            ),
            color: '#F59E0B'
        },
        {
            name: '测试保护性看跌期权',
            action: () => handleApiCall(
                () => userManagementService.calculateProtectivePut({
                    purchasePrice: 100,
                    quantity: 100,
                    optionPremium: 5
                })
            ),
            color: '#8B5CF6'
        },
        {
            name: '测试备兑看涨期权',
            action: () => handleApiCall(
                () => userManagementService.calculateCoveredCall({
                    purchasePrice: 100,
                    quantity: 100,
                    optionPremium: 5
                })
            ),
            color: '#EF4444'
        }
    ];

    return (
        <div style={{ padding: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                API 测试面板
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
                {testCases.map((test, index) => (
                    <button
                        key={index}
                        onClick={test.action}
                        disabled={loading}
                        style={{ 
                            margin: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: test.color,
                            color: 'white',
                            borderRadius: '0.25rem',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {test.name}
                    </button>
                ))}
            </div>

            {loading && <div style={{ color: '#6B7280' }}>加载中...</div>}
            
            {result && (
                <pre style={{ 
                    backgroundColor: '#F3F4F6',
                    padding: '1rem',
                    borderRadius: '0.25rem',
                    marginTop: '1rem',
                    overflow: 'auto'
                }}>
                    {result}
                </pre>
            )}
        </div>
    );
};