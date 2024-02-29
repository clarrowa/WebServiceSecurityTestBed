// Ready made react components from Polaris library
import { Page, Layout, LegacyCard } from '@shopify/polaris';

import { DropDownMenu } from '../Components/common';

function Home() {

    const getUserProfile = () => {

    }

    const updateUserProfile = () => {
      console.log('Updated User Profile');
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
              <p>test</p>
            </LegacyCard>
            {/* <LegacyCard title='Edit User Profile' sectioned primaryFooterAction={{content: 'Run Update', onAction: () => {updateUserProfile()}}}>
              <p>test</p>
            </LegacyCard> */}
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  
  // Exports custom home component
  export default Home;