import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import NavItemLink from './components/common/NavItemLink';
import { User, UserRole } from './services/authService';


interface Props {
  user: User | null
}

const AppNavbar: React.FC<Props> = ({ user }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Link className="navbar-brand" to="/">Hotline</Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">      
        {user &&
          <Nav className="mr-auto">
            <NavItemLink to="/">Koti</NavItemLink>
            <NavItemLink to="/problems/open">Avoimet</NavItemLink>
            <NavItemLink to="/problems/solved">Ratkaistut</NavItemLink>
            {user.role <= UserRole.Power && <NavDropdown title="Asetukset" id="basic-nav-dropdown">
              <NavItemLink to="/usergroups">Käyttäjäryhmät</NavItemLink>
              <NavItemLink to="/users">Käyttäjät</NavItemLink>
              <NavItemLink to="/makes">Automerkit</NavItemLink>
              <NavItemLink to="/models">Automallit</NavItemLink>
            </NavDropdown>}
            <NavItemLink to="/about">Tietoja</NavItemLink>
          </Nav>
        }
        <Nav className="ml-auto">
          {!user &&
            <>
              <NavItemLink to="/login">Kirjaudu</NavItemLink>
            </>
          }
          {user &&
            <>
              <NavDropdown title={user.firstName + ' ' + user.lastName} id="basic-nav-dropdown">
                <NavItemLink to="/profile">Omat tiedot</NavItemLink>
              </NavDropdown>          
              <NavItemLink to="/logout">Kirjaudu ulos</NavItemLink>
            </>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>    
  );
}

export default AppNavbar;