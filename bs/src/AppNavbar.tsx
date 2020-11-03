import React from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import NavItemLink from './components/common/NavItemLink';
import { User } from './services/authService';


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
            <NavItemLink to="/questions/open">Avoimet</NavItemLink>
            <NavItemLink to="/questions/solved">Ratkaistut</NavItemLink>
            <NavItemLink to="/questions/user">Omat</NavItemLink>
            {user.isPowerOrAdmin && <NavDropdown title="Asetukset" id="basic-nav-dropdown">
              <NavItemLink to="/usergroups">Käyttäjäryhmät</NavItemLink>
              <NavItemLink to="/users">Käyttäjät</NavItemLink>
              <NavDropdown.Divider />
              <NavItemLink to="/makes">Automerkit</NavItemLink>
              <NavItemLink to="/models">Automallit</NavItemLink>
              <NavDropdown.Divider />
              <NavItemLink to="/usersessions">Kirjautumiset</NavItemLink>
              <NavItemLink to="/systemlog">Virheloki</NavItemLink>
            </NavDropdown>}
            {user.isPowerOrAdmin && <NavDropdown title="Taulut" id="basic-nav-dropdown">
              <NavItemLink to="/table/usergroups">Käyttäjäryhmät</NavItemLink>
              <NavItemLink to="/table/users">Käyttäjät</NavItemLink>
              <NavItemLink to="/table/makes">Automerkit</NavItemLink>
              <NavItemLink to="/table/models">Automallit</NavItemLink>
              <NavItemLink to="/table/questions">Vikatapaukset</NavItemLink>
            </NavDropdown>}
            <NavItemLink to="/about">Tietoja</NavItemLink>
          </Nav>
        }
        <Nav className="ml-auto">
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
