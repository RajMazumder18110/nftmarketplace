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
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const [nft, setNft] = useState(null);
  const [nftMarketplace, setNftMarketplace] = useState(null);
  const [minitng, setMinting] = useState(true);
  const [minitngTitle, setMintingTitle] = useState('');
  const [minitngProgress, setMintingProgress] = useState('');

  return (
    <MarketPlaceContext.Provider value={{
      myAssetActive, setMyAssetActive,
      walletConnected, setWalletConnected,
      account, setAccount,
      provider, setProvider,
      signer, setSigner,
      marketplace, setMarketplace,
      nft, setNft,
      nftMarketplace, setNftMarketplace,
      minitng, setMinting,
      minitngTitle, setMintingTitle,
      minitngProgress, setMintingProgress
    }}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/nftmarketplace/' element={ <Home/> }/>
          <Route exact path='/nftmarketplace/explore' element={ <Marketplace/> }/>
          <Route exact path='/nftmarketplace/myassets' element={<Profile/>}/>
          <Route path='/nftmarketplace/*' element={ <Home/> }/>
        </Routes>
      </Router>
    </MarketPlaceContext.Provider>
  );
}

export default App;
