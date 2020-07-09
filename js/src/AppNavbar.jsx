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
        <Nav className="mr-auto">
          <NavItemLink to="/">Koti</NavItemLink>
          <NavItemLink to="/movies">Movies</NavItemLink>
          <NavItemLink to="/problems">Vikatapaukset</NavItemLink>
          <NavDropdown title="Asetukset" id="basic-nav-dropdown">
            <NavItemLink to="/usergroups">Käyttäjäryhmät</NavItemLink>
            <NavItemLink to="/users">Käyttäjät</NavItemLink>
            <NavItemLink to="/brands">Automerkit</NavItemLink>
          </NavDropdown>          
          <NavItemLink to="/about">Tietoja</NavItemLink>
        </Nav>
        <Nav className="ml-auto">
          {!user &&
            <>
              <NavItemLink to="/login">Kirjaudu</NavItemLink>
              <NavItemLink to="/register">Rekisteröidy</NavItemLink>
            </>
          }
          {user &&
            <>
              <NavItemLink to="/profile">{user.firstName}</NavItemLink>
              <NavItemLink to="/logout">Kirjaudu ulos</NavItemLink>
            </>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>    
  );
}
