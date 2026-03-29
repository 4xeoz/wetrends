import React from 'react';
import { Navigation } from '@/app/_component/shared/navigation';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='relative'>
            <Navigation />
            {children}
        </div>
    );
};

export default Layout;
