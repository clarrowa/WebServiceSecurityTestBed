// Imports necessary components from main dependencies
import { useState, useEffect } from 'react';

// Ready made react components from Polaris library
import { Page, Layout, LegacyCard } from '@shopify/polaris';

import { DropDownMenu } from '../Components/common';

// Amplify
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuthenticator } from '@aws-amplify/ui-react';

function Home() {

    const [userName, setUserName] = useState('');

    const { user, signOut } = useAuthenticator((context) => [context.user]);

    useEffect(() => {
      fetchUserAndCheckAuth();
    });

    async function fetchUserAndCheckAuth() {
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      if (!accessToken) {
        signOut(user);
      } else {
        setUserName(idToken.payload.email);
      } 
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
              <p>{userName}</p>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  
  // Exports custom home component
  export default Home;