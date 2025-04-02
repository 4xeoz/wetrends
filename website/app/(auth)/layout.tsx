import React from 'react';
import AuthGate from '@/app/_component/auth/authGate';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
    <AuthGate>
        <div>
            <main>{children}</main>
        </div>
    </AuthGate>
    );
};

export default AuthLayout;