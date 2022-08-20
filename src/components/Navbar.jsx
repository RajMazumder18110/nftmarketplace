import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Navbar, NavbarBrand, NavbarToggler,
    Collapse, Nav, NavItem, Container, Button
} from 'reactstrap';
import { useEffect } from 'react';


const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [account, setAccount] = useState(null);
    const toggle = () => setIsOpen(!isOpen);

    const connectWallet = async () => {
        if(typeof window.ethereum !== 'undefined'){
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
            setAccount(accounts[0]);
            setWalletConnected(true);
        }
        else{
            alert('Please install metamask :(')
        }
    }

    window.ethereum.on('accountsChanged', accounts => {
        if(accounts.length > 0){
            setAccount(accounts[0])
        }else{
            setWalletConnected(false)
        }
    })
    
    return (
        <Container>
            <Navbar expand={'md'} dark>
                <NavbarBrand>
                    <NavLink to="/" className="nav-link">
                        <h5 className='brand-title dyna-font'>NFT Market</h5>
                    </NavLink>
                </NavbarBrand>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className='ms-auto' navbar>
                        <NavItem>
                            <NavLink to='/' className="nav-link">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to='/explore' className="nav-link">Explore</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to='/myassets' className="nav-link">My Assets</NavLink>
                        </NavItem>
                        <NavItem>
                            {walletConnected ?
                             <NavLink to='/myassets' className="nav-link">
                                {account && account.replace(account.substring(6, 36), "-XXX-")}
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