import React, { ReactElement } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from '../../components/authentication/Header';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode
}

const theme = createTheme();

function Layout({ children }: LayoutProps): ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <div className="content">
        {children}
      </div>
    </ThemeProvider>
  );
}

export default Layout;
