// Imports necessary components from main dependencies
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jQuery from 'jquery';

// Amplify
import { fetchAuthSession } from "aws-amplify/auth";
import { amplifyConfig } from '../Utils/aws-exports';
import { useAuthenticator } from '@aws-amplify/ui-react';

// Ready made react components from Polaris library
import { Page, Layout, LegacyCard, FormLayout, TextField, InlineError } from '@shopify/polaris';
import { DropDownMenu } from '../Components/common';

function Admin() {
    const navigate = useNavigate();

    const [users, setUsers] = useState('');
    const [userName, setUserName] = useState('');
    const [userDelete, setUserDelete] = useState('');
    const [recordDelete, setRecordDelete] = useState('');
    const [getResponseData, setGetResponseData] = useState('');

    const [userErrorMessage, setUserErrorMessage] = useState('');
    const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

    // Handler functions for updating constant values
    const handleUserChange = useCallback((value) => setUserName(value), []);
    const handleUserDeleteChange = useCallback((value) => setUserDelete(value), []);
    const handleRecordDeleteChange = useCallback((value) => setRecordDelete(value), []);

    const { user, signOut } = useAuthenticator((context) => [context.user]);

    useEffect(() => {
      currentSession();
    })

    async function currentSession() {
      try {
        const { accessToken } = (await fetchAuthSession()).tokens ?? {};
        if (!accessToken) {
          signOut(user);
        } else {
          var groups = accessToken.payload['cognito:groups'];
          if (!groups || groups.toString() !== "Admin") {
            navigate('/');
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    const refreshUsers = () => {
      getActiveUsers();

    }

    const getRecordsPerUser = () => {
      if (!user) {
        setUserErrorMessage('Input Required');
      } else {
        setUserErrorMessage('');
        getRecords(user);
        setUserName('');
      }
    }

    const deleteRecordsPerUser = () => {
      // DELETE UserRecord
      if (!userDelete || !recordDelete) {
        setDeleteErrorMessage('Input Required');
      } else {
        setDeleteErrorMessage('');
        deleteRecord(userDelete, recordDelete);
        setUserDelete('');
        setRecordDelete('');
      }
    }

    async function getActiveUsers() {
      try {
        const { idToken } = (await fetchAuthSession()).tokens ?? {};
  
        jQuery.ajax({
          method: 'GET',
          url: amplifyConfig.api.invokeUrl + '/getactiveusers',
          headers: {
              Authorization: idToken
          },
          contentType: 'application/json',
          success: completeGetUsers,
          error: function ajaxError(jqXHR, textStatus, errorThrown) {
              console.error('Error getting record: ', textStatus, ', Details: ', errorThrown);
              console.error('Response: ', jqXHR.responseText);
              alert('An error occured when getting records:\n' + jqXHR.responseText);
          }
          });
      } catch (err) {
        console.log(err);
      }
    }

    async function getRecords(user) {
      try {
        const { idToken } = (await fetchAuthSession()).tokens ?? {};
  
        jQuery.ajax({
          method: 'POST',
          url: amplifyConfig.api.invokeUrl + '/getrecords',
          headers: {
              Authorization: idToken
          },
          data: JSON.stringify({
            Content: {
              UserId: user,
            }
          }),
          contentType: 'application/json',
          success: completeGetReturn,
          error: function ajaxError(jqXHR, textStatus, errorThrown) {
              console.error('Error getting record: ', textStatus, ', Details: ', errorThrown);
              console.error('Response: ', jqXHR.responseText);
              alert('An error occured when getting records:\n' + jqXHR.responseText);
          }
          });
      } catch (err) {
        console.log(err);
      }
    }

    async function deleteRecord(userId, recordId) {
      try {
        const { idToken } = (await fetchAuthSession()).tokens ?? {};
  
        jQuery.ajax({
          method: 'DELETE',
          url: amplifyConfig.api.invokeUrl + '/deleterecords',
          headers: {
              Authorization: idToken
          },
          data: JSON.stringify({
            Content: {
              UserId: userId,
              RecordId: recordId
            }
          }),
          contentType: 'application/json',
          error: function ajaxError(jqXHR, textStatus, errorThrown) {
              console.error('Error getting record: ', textStatus, ', Details: ', errorThrown);
              console.error('Response: ', jqXHR.responseText);
              alert('An error occured when getting records:\n' + jqXHR.responseText);
          }
          });
      } catch (err) {
        console.log(err);
      }
    }

    function completeGetReturn(result) {
      return (
          setGetResponseData(`${JSON.stringify(result.Data.Items)}`)
      );
    }

    function completeGetUsers(result) {
      let items = result.Data.Items; 
      let users = [
        ...new Set(items.map(user => user.UserId))
      ];

      return (
          setUsers(`${JSON.stringify(users)}`)
      );
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
            <LegacyCard title='Users' sectioned primaryFooterAction={{content: 'Get Users', onAction: () => {refreshUsers()}}}>
              <p>{users}</p>
            </LegacyCard>
            <LegacyCard title='Records per User' sectioned primaryFooterAction={{content: 'Get User Records', onAction: () => {getRecordsPerUser()}}}>
              <FormLayout>
                <TextField
                value={userName}
                placeholder='username@gmail.com'
                onChange={handleUserChange}
                />
                <InlineError message={userErrorMessage} />
                <p>{getResponseData}</p>
              </FormLayout>
            </LegacyCard>
            <LegacyCard title='Delete User Records' sectioned primaryFooterAction={{content: 'Run Delete', onAction: () => {deleteRecordsPerUser()}}}>
              <FormLayout>
                <TextField
                value={userDelete}
                placeholder='username@gmail.com'
                onChange={handleUserDeleteChange}
                />
                <TextField
                value={recordDelete}
                placeholder='Record Id'
                onChange={handleRecordDeleteChange}
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