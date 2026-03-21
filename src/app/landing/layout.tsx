import { Inter } from 'next/font/google';


import { ReactNode } from 'react';
import Footer from '@/components/shared/Footer/Footer';

import NavbarSecondary from '@/containers/LandingPage/NavbarSecondary';


const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

interface LayoutProps {
    children: ReactNode;
}
const navItems = [
    { name: "Home", href: "/landing" },
    { name: "Challenges", href: "/challenges" },
];

const Layout = ({ children }: LayoutProps) => {
    return (

        <div className={inter.variable}>
            <NavbarSecondary navItems={navItems} />
            <div className=''>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;