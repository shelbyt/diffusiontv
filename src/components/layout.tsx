import React, { ReactNode } from 'react';
import Navbar from './navbar';
import TopNavbar from './topNavbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      {/* <TopNavbar/> */}
      {children}
      <Navbar />
    </div>
  );
}

export default Layout;