import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace'
import Profile from './pages/Profile'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path='/' element={ <Home/> }/>
        <Route exact path='/explore' element={ <Marketplace/> }/>
        <Route exact path='/myassets' element={ <Profile/> }/>
        <Route path='/' element={ <Home/> }/>
      </Routes>
    </Router>
  );
}

export default App;
