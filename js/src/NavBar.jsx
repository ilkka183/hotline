import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function NavBar({ user }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Hotline</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="navbar-nav">
          <NavLink className="nav-item nav-link" to="/">Koti</NavLink>
          <NavLink className="nav-item nav-link" to="/movies">Movies</NavLink>
          <NavLink className="nav-item nav-link" to="/usergroups">Käyttäjäryhmät</NavLink>
          <NavLink className="nav-item nav-link" to="/users">Käyttäjät</NavLink>
          {!user &&
            <>
              <NavLink className="nav-item nav-link" to="/login">Kirjaudu</NavLink>
              <NavLink className="nav-item nav-link" to="/register">Rekisteröidy</NavLink>
            </>
          }
          {user &&
            <>
              <NavLink className="nav-item nav-link" to="/profile">{user.firstName}</NavLink>
              <NavLink className="nav-item nav-link" to="/logout">Kirjaudu ulos</NavLink>
            </>
          }
        </div>
      </div>
    </nav>    
  );
}
