import React, { ReactElement } from 'react';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import Header from '../../components/authentication/Header';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode
}

const theme = createMuiTheme();

// const useStyles = makeStyles((theme) => {
//   root: {
//   }
// });

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
