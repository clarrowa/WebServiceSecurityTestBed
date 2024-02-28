// Imports necessary components from main dependencies
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Amplify
import { fetchAuthSession } from "aws-amplify/auth";

// Ready made react components from Polaris library
import { Page, Layout, LegacyCard } from '@shopify/polaris';
import { DropDownMenu } from '../Components/common';

function Admin() {
    const navigate = useNavigate();

    useEffect(() => {
      currentSession();
    })

    async function currentSession() {
      try {
        const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
        var groups = accessToken.payload['cognito:groups'];
          if (!groups || groups.toString() !== "Admin") {
            navigate('/');
        }
        console.log(`jwtToken: ${JSON.stringify(idToken)}`);
      } catch (err) {
        console.log(err);
      }
    }

    const listUsers = () => {
      
    }

    const refreshUsers = () => {
      const users = listUsers();
      console.log("Refreshed Users");
    }

    const getRecordsPerUser = () => {
      console.log("Got User's Records");
    }

    const deleteRecordsPerUser = () => {
      console.log("Deleted User's Records");
    }

    const deleteAllRecords = () => {
      console.log('Deleted All Records');
    }
  
    // Module returns Admin page component
    return (
      <Page 
      title='Admin'
      primaryAction={<DropDownMenu/>}
      divider
      >
      <Layout>
          <Layout.Section>
            <LegacyCard title='Users' sectioned primaryFooterAction={{content: 'Refresh', onAction: () => {refreshUsers()}}}>
              <p>test</p>
            </LegacyCard>
            <LegacyCard title='Records per User' sectioned primaryFooterAction={{content: 'Get User Records', onAction: () => {getRecordsPerUser()}}}>
              <p>test</p>
            </LegacyCard>
            <LegacyCard title='Delete User Records' sectioned primaryFooterAction={{content: 'Run Delete', onAction: () => {deleteRecordsPerUser()}}}>
              <p>test</p>
            </LegacyCard>
            <LegacyCard title='Delete All Record' sectioned primaryFooterAction={{content: 'Run Delete', onAction: () => {deleteAllRecords()}}}>
              <p>test</p>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    );
}
  
// Exports custom admin component
export default Admin;