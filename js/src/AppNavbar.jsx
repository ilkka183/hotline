import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import NavItemLink from './components/common/NavItemLink';


export default function AppNavbar({ user }) {
  return (
    <Navbar bg="light" expand="lg">
      <Link className="navbar-brand" to="/">Hotline</Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">      
        {user &&
          <Nav className="mr-auto">
            <NavItemLink to="/">Koti</NavItemLink>
            <NavItemLink to="/problems">Vikatapaukset</NavItemLink>
            <NavDropdown title="Asetukset" id="basic-nav-dropdown">
              <NavItemLink to="/usergroups">Käyttäjäryhmät</NavItemLink>
              <NavItemLink to="/users">Käyttäjät</NavItemLink>
              <NavItemLink to="/brands">Automerkit</NavItemLink>
            </NavDropdown>
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
                <NavItemLink to="/changepassword">Vaihda salasana</NavItemLink>
              </NavDropdown>          
              <NavItemLink to="/logout">Kirjaudu ulos</NavItemLink>
            </>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>    
  );
}
