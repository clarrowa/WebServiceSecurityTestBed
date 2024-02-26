// Imports necessary components from main dependencies
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Amplify Authenticator Hook
import { useAuthenticator } from '@aws-amplify/ui-react';

// Ready made react components from Polaris library
import { Page, Layout } from '@shopify/polaris';

function Admin() {
    const navigate = useNavigate();

    const { user, signOut } = useAuthenticator((context) => [context.user]);

    const logoutHandler = () => {
        signOut(user);
        navigate('/');
    };
  
    // Module returns Admin page component
    return (
      <Page 
      title='Admin'
      secondaryActions={[{content: 'Log Out', onAction: () => {logoutHandler()}}]}
      divider
      >
      <Layout>
          <Layout.Section>
            
          </Layout.Section>
        </Layout>
      </Page>
    );
}
  
// Exports custom admin component
export default Admin;