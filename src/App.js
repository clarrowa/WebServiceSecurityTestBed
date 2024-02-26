// React components utilised for webpage navigation
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Imports Page components from Pages folder
import Login from './Pages/Login';
import Search from './Pages/Search';
import Admin from './Pages/Admin';

function App() {

  // Router defines page web pathing
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Login/>} />
        <Route excat path='/search' element={<Search/>} />
        <Route excat path='/admin' element={<Admin/>} />
        </Routes>
    </Router>
  );
}

export default App;
