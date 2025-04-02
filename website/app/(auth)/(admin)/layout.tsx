import React from 'react';



const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className=' relative'>
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;