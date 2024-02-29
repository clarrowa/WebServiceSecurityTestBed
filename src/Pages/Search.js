// Imports necessary components from main dependencies
import { useState, useCallback, useEffect } from 'react';
import jQuery from 'jquery';

// Amplify
import { fetchAuthSession } from "aws-amplify/auth";
import { amplifyConfig } from '../Utils/aws-exports';

// Ready made react components from Polaris library
import { Page, Layout, LegacyCard, TextField, FormLayout, InlineError } from '@shopify/polaris';
import { DropDownMenu } from '../Components/common';

function Search() {

  const [records, setRecords] = useState('');
  const [recordId, setRecordId] = useState('');
  const [updateRecordId, setUpdateRecordId] = useState('');
  const [recordData, setRecordData] = useState('');
  const [updateRecordData, setUpdateRecordData] = useState('');
  const [responseData, setResponseData] = useState('');

  const [newRecordErrorMessage, setNewRecordErrorMessage] = useState('');
  const [updateRecordErrorMessage, setUpdateRecordErrorMessage] = useState('');

  // Handler functions for updating constant values
  const handleRecordIdChange = useCallback((value) => setRecordId(value), []);
  const handleUpdateRecordIdChange = useCallback((value) => setUpdateRecordId(value), []);
  const handleRecordDataChange = useCallback((value) => setRecordData(value), []);
  const handleUpdateRecordDataChange = useCallback((value) => setUpdateRecordData(value), []);

  useEffect(() => {
    if (responseData){
      alert(responseData)
      setResponseData('');
    }
  });

    const getUserRecords = () => {

    }

    const refreshRecords = () => {
      let userRecords = getUserRecords();
      console.log('Refreshed');
    }

    async function createRecord() {
      if (!recordId || !recordData) {
        setNewRecordErrorMessage('Inputs required');
      } else {
        setNewRecordErrorMessage('');
        putRecord(recordId, recordData);
        setRecordId('');
        setRecordData('');
      }
    }

    const updateRecord = () => {
      if (!updateRecordId || !updateRecordData) {
        setUpdateRecordErrorMessage('Inputs required');
      } else {
        setUpdateRecordErrorMessage('');
        console.log('Updated Record');
        setRecordId('');
        setRecordData('');
      }
    }

    async function putRecord(recordId, recordData) {
      try {
        const { idToken } = (await fetchAuthSession()).tokens ?? {};
  
        jQuery.ajax({
          method: 'POST',
          url: amplifyConfig.api.invokeUrl + '/createrecord',
          headers: {
              Authorization: idToken
          },
          data: JSON.stringify({
              Content: {
                  RecordId: recordId,
                  RecordData: recordData
              }
          }),
          contentType: 'application/json',
          success: completeReturn,
          error: function ajaxError(jqXHR, textStatus, errorThrown) {
              console.error('Error creating record: ', textStatus, ', Details: ', errorThrown);
              console.error('Response: ', jqXHR.responseText);
              alert('An error occured when creating record:\n' + jqXHR.responseText);
          }
          });
      } catch (err) {
        console.log(err);
      }
  }
  
  function completeReturn(result) {
      return (
          setResponseData(`Successful API Call, Response: ${JSON.stringify(result)}`)
      );
  }

  // POST UpdateRecord - is also update
  // GET UserRecord


    // Module returns Search page component
    return (
      <Page 
      title='Search'
      primaryAction={<DropDownMenu/>}
      divider
      >
      <Layout>
          <Layout.Section>
            <LegacyCard title='Records' sectioned primaryFooterAction={{content: 'Refresh', onAction: () => {refreshRecords()}}} disa>
              <p>test</p>
            </LegacyCard>
            <LegacyCard title='Create Record' sectioned primaryFooterAction={{content: 'Run Create', onAction: () => {createRecord()}}}>
              <FormLayout>
                <TextField
                value={recordId}
                placeholder='Your Record ID'
                onChange={handleRecordIdChange}
                />
                <TextField
                value={recordData}
                placeholder='Your Record Data'
                onChange={handleRecordDataChange}
                />
                <InlineError message={newRecordErrorMessage} />
              </FormLayout>
            </LegacyCard>
            <LegacyCard title='Update Record' sectioned primaryFooterAction={{content: 'Run Update', onAction: () => {updateRecord()}}}>
              <FormLayout>
                <TextField
                value={updateRecordId}
                placeholder='Record ID to update'
                onChange={handleUpdateRecordIdChange}
                />
                <TextField
                value={updateRecordData}
                placeholder='Your updated Record Data'
                onChange={handleUpdateRecordDataChange}
                />
                <InlineError message={updateRecordErrorMessage} />
              </FormLayout>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    );
}
  
// Exports custom search component
export default Search;