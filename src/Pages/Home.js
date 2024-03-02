// Imports necessary components from main dependencies
import { useState, useEffect } from 'react';

// Ready made react components from Polaris library
import { Page, Layout, LegacyCard } from '@shopify/polaris';

import { DropDownMenu } from '../Components/common';

import { fetchAuthSession } from "aws-amplify/auth";

function Home() {

    const [user, setUser] = useState('');

    useEffect(() => {
      fetchUser();
    });

    async function fetchUser() {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      setUser(idToken.payload.email);
    }

    // Module returns Login page components, a card for login fields
    return (
      <Page 
      title='Home'
      primaryAction={<DropDownMenu/>}
      divider
      >
      <Layout>
          <Layout.Section>
            <LegacyCard title='User Profile' sectioned>
              <p>{user}</p>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  
  // Exports custom home component
  export default Home;