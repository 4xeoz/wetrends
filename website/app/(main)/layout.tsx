import React from 'react';
import Navbar from '../_component/shared/header';
import LoadingPage from '../_component/shared/loading-page';
import Footer from '../_component/shared/footer';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className=' relative overflow-hidden'>
            <div className='z-50'>
                <LoadingPage />
            </div>
            <div className='z-40'>
                <Navbar />
            </div>
            <main>
                {children}
            </main>
            {/* <Footer/> */}
        </div>
    );
};

export default Layout;