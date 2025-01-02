import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c4dff',
    },
    secondary: {
      main: '#448aff',
    },
    background: {
      default: 'linear-gradient(135deg, #0f0c29, #302b63)',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: 'rgba(224, 224, 224, 0.7)',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #0f0c29, #302b63)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#1a1a2e',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(135deg, #7c4dff, #448aff)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #6e40e5, #3c7ae0)',
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
