import React from 'react';
import { createRoot } from 'react-dom/client';
import '@shopify/polaris/build/esm/styles.css';
import App from './App';
import { AppProvider } from '@shopify/polaris';
import { Authenticator, View } from '@aws-amplify/ui-react';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Utilises Polaris AppProvider component
// Imports custom App component from ./App
root.render(
  <AppProvider>
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  </AppProvider>,
);