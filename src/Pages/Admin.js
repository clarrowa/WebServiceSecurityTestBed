// Imports necessary components from main dependencies
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Amplify
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from "aws-amplify/auth";

// Ready made react components from Polaris library
import { Page, Layout } from '@shopify/polaris';

function Admin() {
    const navigate = useNavigate();

    const { user, signOut } = useAuthenticator((context) => [context.user]);

    useEffect(() => {
      currentSession();
    })

    async function currentSession() {
      try {
        const { accessToken } = (await fetchAuthSession()).tokens ?? {};
        var groups = accessToken.payload['cognito:groups'];
          if (!groups || groups.toString() !== "Admin") {
            navigate('/');
        }
      } catch (err) {
        console.log(err);
      }
    }

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