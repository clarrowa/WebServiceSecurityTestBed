// Imports necessary components from main dependencies
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Amplify
import { deleteUser, fetchAuthSession } from "aws-amplify/auth";
import { amplifyConfig } from '../Utils/aws-exports';

// Ready made react components from Polaris library
import { Page, Layout, LegacyCard, FormLayout, TextField, InlineError } from '@shopify/polaris';
import { DropDownMenu } from '../Components/common';

function Admin() {
    const navigate = useNavigate();

    const [users, setUsers] = useState('');
    const [user, setUser] = useState('');
    const [userDelete, setUserDelete] = useState('');
    const [records, setRecords] = useState('');

    const [userErrorMessage, setUserErrorMessage] = useState('');
    const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

    // Handler functions for updating constant values
    const handleUserChange = useCallback((value) => setUser(value), []);
    const handleUserDeleteChange = useCallback((value) => setUserDelete(value), []);

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

    const listUsers = () => {
      
    }

    const refreshUsers = () => {
      console.log("Refreshed Users");

    }

    const getRecordsPerUser = () => {
      if (!user) {
        setUserErrorMessage('Input Required');
      } else {
        setUserErrorMessage('');

        console.log(user);
      }
    }

    const deleteRecordsPerUser = () => {
      if (!userDelete) {
        setDeleteErrorMessage('Input Required');
      } else {
        setDeleteErrorMessage('');
        console.log(userDelete);
      }
    }

    const deleteAllRecords = () => {
      console.log('Deleted All Records');
    }

    // GET UserRecord - with parameter
    // DELETE UserRecord
    // DELETE Records
  
    // Module returns Admin page component
    return (
      <Page 
      title='Admin'
      primaryAction={<DropDownMenu/>}
      divider
      >
      <Layout>
          <Layout.Section>
            <LegacyCard title='Users' sectioned primaryFooterAction={{content: 'Refresh', onAction: () => {refreshUsers()}}} secondaryFooterActions={[{content: 'Delete All Records', onAction: () => {deleteAllRecords()}}]}>
              <p>test</p>
            </LegacyCard>
            <LegacyCard title='Records per User' sectioned primaryFooterAction={{content: 'Get User Records', onAction: () => {getRecordsPerUser()}}}>
              <FormLayout>
                <TextField
                value={user}
                placeholder='username@gmail.com'
                onChange={handleUserChange}
                />
                <InlineError message={userErrorMessage} />
              </FormLayout>
            </LegacyCard>
            <LegacyCard title='Delete User Records' sectioned primaryFooterAction={{content: 'Run Delete', onAction: () => {deleteRecordsPerUser()}}}>
              <FormLayout>
                <TextField
                value={userDelete}
                placeholder='username@gmail.com'
                onChange={handleUserDeleteChange}
                />
                <InlineError message={deleteErrorMessage} />
              </FormLayout>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    );
}
  
// Exports custom admin component
export default Admin;