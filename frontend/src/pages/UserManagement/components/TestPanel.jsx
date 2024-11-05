import { useState } from 'react';
import { userManagementService } from '../../../services/userManagement.service';

export const TestPanel = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [inputValues, setInputValues] = useState({});

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

    const handleInputChange = (name, value) => {
        setInputValues({
            ...inputValues,
            [name]: value,
        });
    };

    const testCases = [
        {
            name: 'Test Update Email',
            action: () => handleApiCall(
                () => userManagementService.updateUserEmail(
                    parseInt(inputValues['updateEmailUserId'] || 1),
                    inputValues['updateEmail'] || 'test@example.com'
                )
            ),
            inputs: [
                { name: 'updateEmailUserId', placeholder: 'User ID', type: 'number' },
                { name: 'updateEmail', placeholder: 'Email', type: 'email' }
            ],
            color: '#3B82F6'
        },
        {
            name: 'Test Add Transaction',
            action: () => handleApiCall(
                () => userManagementService.addTransaction({
                    userId: parseInt(inputValues['addTransactionUserId'] || 1),
                    tradeTypeId: parseInt(inputValues['tradeTypeId'] || 1),
                    stockSymbol: inputValues['stockSymbol'] || 'AAPL',
                    quantity: parseInt(inputValues['quantity'] || 100),
                    price: parseFloat(inputValues['price'] || 150.50)
                })
            ),
            inputs: [
                { name: 'addTransactionUserId', placeholder: 'User ID', type: 'number' },
                { name: 'tradeTypeId', placeholder: 'Trade Type ID', type: 'number' },
                { name: 'stockSymbol', placeholder: 'Stock Symbol', type: 'text' },
                { name: 'quantity', placeholder: 'Quantity', type: 'number' },
                { name: 'price', placeholder: 'Price', type: 'number' }
            ],
            color: '#10B981'
        },
        {
            name: 'Test Get Transaction Count',
            action: () => handleApiCall(
                () => userManagementService.getUserTransactionCount(
                    parseInt(inputValues['transactionCountUserId'] || 1)
                )
            ),
            inputs: [
                { name: 'transactionCountUserId', placeholder: 'User ID', type: 'number' }
            ],
            color: '#F59E0B'
        },
        {
            name: 'Test Protective Put',
            action: () => handleApiCall(
                () => userManagementService.calculateProtectivePut({
                    purchasePrice: parseFloat(inputValues['protectivePutPurchasePrice'] || 100),
                    quantity: parseInt(inputValues['protectivePutQuantity'] || 100),
                    optionPremium: parseFloat(inputValues['protectivePutOptionPremium'] || 5)
                })
            ),
            inputs: [
                { name: 'protectivePutPurchasePrice', placeholder: 'Purchase Price', type: 'number' },
                { name: 'protectivePutQuantity', placeholder: 'Quantity', type: 'number' },
                { name: 'protectivePutOptionPremium', placeholder: 'Option Premium', type: 'number' }
            ],
            color: '#8B5CF6'
        },
        {
            name: 'Test Covered Call',
            action: () => handleApiCall(
                () => userManagementService.calculateCoveredCall({
                    purchasePrice: parseFloat(inputValues['coveredCallPurchasePrice'] || 100),
                    quantity: parseInt(inputValues['coveredCallQuantity'] || 100),
                    optionPremium: parseFloat(inputValues['coveredCallOptionPremium'] || 5)
                })
            ),
            inputs: [
                { name: 'coveredCallPurchasePrice', placeholder: 'Purchase Price', type: 'number' },
                { name: 'coveredCallQuantity', placeholder: 'Quantity', type: 'number' },
                { name: 'coveredCallOptionPremium', placeholder: 'Option Premium', type: 'number' }
            ],
            color: '#EF4444'
        }
    ];

    return (
        <div style={{ padding: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                API Test Panel
            </h2>

            <div style={{ marginBottom: '1rem' }}>
                {testCases.map((test, index) => (
                    <div key={index} style={{ marginBottom: '1rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                            {test.inputs.map((input, i) => (
                                <input
                                    key={i}
                                    type={input.type}
                                    placeholder={input.placeholder}
                                    value={inputValues[input.name] || ''}
                                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                                    style={{
                                        marginRight: '0.5rem',
                                        padding: '0.5rem',
                                        borderRadius: '0.25rem',
                                        border: '1px solid #D1D5DB'
                                    }}
                                />
                            ))}
                        </div>
                        <button
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
                    </div>
                ))}
            </div>

            {loading && <div style={{ color: '#6B7280' }}>Loading...</div>}

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