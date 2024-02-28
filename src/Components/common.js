import {useState, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthenticator } from '@aws-amplify/ui-react';

import { Button, Popover, ActionList } from '@shopify/polaris';


function DropDownMenu() {
    const navigate = useNavigate();
    const [active, setActive] = useState(false);

    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const toggleActive = useCallback(() => setActive((active) => !active), []);

    const logoutHandler = () => {
        signOut(user);
    }
    
    const activator = (
        <Button onClick={toggleActive} disclosure>
          Pages
        </Button>
    )

    const navigateHome = () => {
        navigate('/');
    }
    

    const navigateSearch = () => {
        navigate('/search');
    }

    const navigateAdmin = () => {
        navigate('/admin');
    }
    
    return (
        <div style={{height: '250px'}}>
          <Popover
            active={active}
            activator={activator}
            autofocusTarget="first-node"
            onClose={toggleActive}
          >
            <ActionList
              actionRole="menuitem"
              sections={[
                {
                  items: [
                    {
                      content: 'Home',
                      helpText: 'User Profile',
                      onAction: () => {navigateHome()},
                    },
                    {
                      content: 'Search',
                      helpText: 'Manage Your Records',
                      onAction: () => {navigateSearch()},
                    },
                    {
                      content: 'Administration',
                      helpText: 'Admin Access All Records',
                      onAction: () => {navigateAdmin()},
                    },
                    {
                      content: 'Log Out',
                      helpText: 'Log Out & Clear Access Tokens',
                      onAction: () => {logoutHandler()},
                    },
                  ],
                },
              ]}
            />
          </Popover>
        </div>
    );
}

export {
    DropDownMenu
};