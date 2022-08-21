import { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ethers } from 'ethers';
import {
    Navbar, NavbarBrand, NavbarToggler,
    Collapse, Nav, NavItem, Container, Button
} from 'reactstrap';

import { MarketPlaceContext } from '../contexts';

import NFT from '../contracts/NFT.json';
import NFTMarketplace from '../contracts/NFTMarketplace.json';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const { walletConnected, setWalletConnected,
            account, setAccount,
            setSigner, setProvider,
            setNftMarketplace, setNft } = useContext(MarketPlaceContext);

    const connectWallet = async () => {
        if(typeof window.ethereum !== 'undefined'){
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // #########################################
            const { chainId } = await provider.getNetwork();
            // ########################################
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(
                NFT.networks[chainId.toString()].address, NFT.abi, signer
            )
            const nftMarketplaceContract = new ethers.Contract(
                NFTMarketplace.networks[chainId.toString()].address, NFTMarketplace.abi, signer
            )
            setNft(nftContract)
            setNftMarketplace(nftMarketplaceContract);
            setSigner(signer);
            setProvider(provider);
            setAccount(accounts[0]);
            setWalletConnected(true);
        }
        else{
            alert('Please install metamask :(')
        }
    }

    if(window.ethereum){
        window.ethereum.on('accountsChanged', accounts => {
            if(accounts.length > 0){
                setAccount(accounts[0])
            }else{
                setAccount('')
                setWalletConnected(false)
            }
        })
    }

    return (
        <Container>
            <Navbar expand={'md'} dark>
                <NavbarBrand>
                    <NavLink to="/nftmarketplace/" className="nav-link">
                        <h5 className='brand-title dyna-font'>NFT Market</h5>
                    </NavLink>
                </NavbarBrand>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className='ms-auto' navbar>
                        <NavItem>
                            <NavLink to='/nftmarketplace/' className="nav-link">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to='/nftmarketplace/explore' className="nav-link">Explore</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to='/nftmarketplace/myassets' className="nav-link">My Assets</NavLink>
                        </NavItem>
                        <NavItem>
                            {walletConnected ?
                             <NavLink to='/nftmarketplace/myassets' className="nav-link">
                                <i className="fa-brands fa-ethereum"></i> {account && account.replace(account.substring(6, 36), "-XXX-")}
                             </NavLink>
                             : <Button className="ms-3 btn-custom px-4" onClick={connectWallet}>Connect</Button>
                            }
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </Container>
    )
}

export default NavBar;