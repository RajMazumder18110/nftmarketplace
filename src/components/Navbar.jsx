import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Navbar, NavbarBrand, NavbarToggler,
    Collapse, Nav, NavItem, Container
} from 'reactstrap';


const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

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
                            <NavLink to='/contact' className="nav-link">Contact</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </Container>
    )
}

export default NavBar;