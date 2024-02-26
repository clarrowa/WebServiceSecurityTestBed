// Imports necessary components from main dependencies
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Ready made react components from Polaris library
import { Page, Layout } from '@shopify/polaris';

// Utils
import { logoutHandler } from '../Utils/utils';

function Admin() {

    const navigate = useNavigate();

    const logoutHandler = () => {
        //logout code, clear access token from utils
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