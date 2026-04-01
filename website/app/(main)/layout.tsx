import React from 'react';
import { Navigation } from '@/app/_component/shared/navigation';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='relative'>
            <Navigation />
            {/* Add top padding to account for fixed header - all pages get this padding */}
            <main className="pt-[72px]">
                {children}
            </main>
        </div>
    );
};

export default Layout;
