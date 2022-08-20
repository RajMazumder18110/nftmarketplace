import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MarketPlaceContext } from './contexts';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace'
import Profile from './pages/Profile'

const App = () => {
  const [myAssetActive, setMyAssetActive] = useState('owned');
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);

  return (
    <MarketPlaceContext.Provider value={{
      myAssetActive, setMyAssetActive,
      walletConnected, setWalletConnected,
      account, setAccount
    }}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={ <Home/> }/>
          <Route exact path='/explore' element={ <Marketplace/> }/>
          <Route exact path='/myassets' element={<Profile/>}/>
          <Route path='/' element={ <Home/> }/>
        </Routes>
      </Router>
    </MarketPlaceContext.Provider>
  );
}

export default App;
