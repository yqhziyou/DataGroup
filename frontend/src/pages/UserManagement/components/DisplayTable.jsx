export const DisplayTable = ({ setLoading, setResult }) => {
    const tables = [
        'AUDITLOG',
        'LOOKUP',
        'STRATEGY',
        'TRANSACTIONHISTORY',
        'USERINFORMATION'
    ];

    const handleTableDisplay = async (tableName) => {
        setLoading(true);
        try {
            const response = await executeSQLQuery(`SELECT * FROM ${tableName}`);
            setResult(JSON.stringify(response, null, 2));
        } catch (error) {
            setResult(JSON.stringify(error.response?.data || error.message, null, 2));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            {tables.map((table, index) => (
                <button
                    key={index}
                    onClick={() => handleTableDisplay(table)}
                    style={{
                        margin: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#6B7280',
                        color: 'white',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Display {table} Table
                </button>
            ))}
        </div>
    );
};