// AWS Amplify Cognito Authentication
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from './Utils/aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// React components utilised for webpage navigation
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Imports Page components from Pages folder
import Home from './Pages/Home';
import Search from './Pages/Search';
import Admin from './Pages/Admin';

// Configures Amplify
Amplify.configure(amplifyConfig);

function App() {

  // Router defines page web pathing
  return (
    <Authenticator>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route excat path='/search' element={<Search/>} />
          <Route excat path='/admin' element={<Admin/>} />
        </Routes>
      </Router>
    </Authenticator>
  );
}

export default App;
