// Imports necessary components from main dependencies
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Ready made react components from Polaris library
import { Page, ButtonGroup, Button, Card, Text, FormLayout, TextField, Layout, InlineError, Select } from '@shopify/polaris';

function Login() {
    const navigate = useNavigate();
    const defaultString = '';
    
    // Defines page constants and their state update functions
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [selectedDropdown, setSelectedDropdown] = useState('user');

    const [isInvalid, setIsInvalid] = useState(false);
    const [userInvalid, setUserInvalid] = useState(false);
    const [invalidInput, setInvalidInput] = useState(false);
    
    const [errorLoginMessage, setErrorLoginMessage] = useState('');
  
    // Handler functions for updating constant values
    const handleUsernameChange = useCallback((value) => setUsername(value), []);
    const handlePasswordChange = useCallback((value) => setPassword(value), []);
    const handleNewUsernameChange = useCallback((value) => setNewUsername(value), []);
    const handleNewPasswordChange = useCallback((value) => setNewPassword(value), []);
    const handleSelectChange = useCallback((value) => setSelectedDropdown(value), [],);
  
    const dropdownOptions = [
        {label: 'User', value: 'user'},
        {label: 'Admin', value: 'admin'},
    ];

    // Function facilitates login
    const submitLogin = () => {
        if (selectedDropdown != 'user') {
            navigate('/admin');
        } else {
            navigate('/search');
        }
    };
  
    // New User registration, triggers alert on completion and error
    const createUser = () => {
      
    }
  
    // Module returns Login page components, a card for login fields
    return (
      <Page 
      title='Login'
      divider
      >
      <Layout>
          <Layout.Section>
              <Card sectioned>
                <FormLayout>
                <Text>Access User Dashboard</Text>
                  <TextField
                  value={username}
                  placeholder='username'
                  onChange={handleUsernameChange}
                  error={userInvalid}
                  type='username'
                  />
                  <TextField
                  value={password}
                  placeholder='password'
                  onChange={handlePasswordChange}
                  error={isInvalid}
                  type='password'
                  />
                  <Select
                  label="Auth Level"
                  options={dropdownOptions}
                  onChange={handleSelectChange}
                  value={selectedDropdown}
                  />
                  <div style={{marginTop: '4px'}}>
                    <InlineError message={errorLoginMessage} />
                  </div>
                  <ButtonGroup fullWidth={true}>
                    <Button onClick={submitLogin}>Login</Button>
                  </ButtonGroup>
                </FormLayout>
              </Card>
          </Layout.Section>
          <Layout.Section>
              <Card sectioned>
                <FormLayout>
                <Text>Register a New User</Text>
                  <TextField
                  value={newUsername}
                  placeholder='username'
                  onChange={handleNewUsernameChange}
                  error={userInvalid}
                  type='username'
                  />
                  <TextField
                  value={newPassword}
                  placeholder='password'
                  onChange={handleNewPasswordChange}
                  error={isInvalid}
                  type='password'
                  />
                  <div style={{marginTop: '4px'}}>
                    <InlineError message={errorLoginMessage} />
                  </div>
                  <ButtonGroup fullWidth={true}>
                    <Button onClick={createUser}>Register</Button>
                  </ButtonGroup>
                </FormLayout>
              </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  
  // Exports custom login component
  export default Login;