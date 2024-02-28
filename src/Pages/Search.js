// Imports necessary components from main dependencies
import { useState, useCallback } from 'react';

// Ready made react components from Polaris library
import { Page, Layout, LegacyCard } from '@shopify/polaris';
import { DropDownMenu } from '../Components/common';

function Search() {

    const getUserRecords = () => {

    }

    const refreshRecords = () => {
      let userRecords = getUserRecords();
      console.log('Refreshed');
    }

    const createRecord = () => {
      console.log('Created Record');
    }

    const updateRecord = () => {
      console.log('Updated Record');
    }

    const deleteRecord = () => {
      console.log('Delete Record');
    }

    // Module returns Search page component
    return (
      <Page 
      title='Search'
      primaryAction={<DropDownMenu/>}
      divider
      >
      <Layout>
          <Layout.Section>
            <LegacyCard title='Records' sectioned primaryFooterAction={{content: 'Refresh', onAction: () => {refreshRecords()}}}>
              <p>test</p>
            </LegacyCard>
            <LegacyCard title='Create Record' sectioned primaryFooterAction={{content: 'Run Create', onAction: () => {createRecord()}}}>
              <p>test</p>
            </LegacyCard>
            <LegacyCard title='Update Record' sectioned primaryFooterAction={{content: 'Run Update', onAction: () => {updateRecord()}}}>
              <p>test</p>
            </LegacyCard>
            <LegacyCard title='Delete Record' sectioned primaryFooterAction={{content: 'Run Delete', onAction: () => {deleteRecord()}}}>
              <p>test</p>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    );
}
  
// Exports custom search component
export default Search;