import React, { ReactElement } from 'react';
import Header from '../../components/Authentication/Header';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode
}

function Layout({ children }: LayoutProps): ReactElement {
  return (
    <div>
      <Header />
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default Layout;
