import React from 'react';
import AuthGate from '@/app/_component/auth/authGate';



const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AuthGate requireAuth>
            <div className='relative'>
                <main>
                    {children}
                </main>
            </div>
        </AuthGate>
    );
};

export default Layout;
