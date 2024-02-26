import React from 'react';
import { createRoot } from 'react-dom/client';
import '@shopify/polaris/build/esm/styles.css';
import App from './App';
import { AppProvider } from '@shopify/polaris';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Utilises Polaris AppProvider component
// Imports custom App component from ./App
root.render(
  <AppProvider>
     <App />
  </AppProvider>,
);