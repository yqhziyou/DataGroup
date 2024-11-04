import { TestPanel } from './components/TestPanel';

export const UserManagementPage = () => {
    return (
        <div>
            <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold',
                padding: '1rem',
                borderBottom: '1px solid #E5E7EB'
            }}>
                User Management
            </h1>
            <TestPanel />
        </div>
    );
};