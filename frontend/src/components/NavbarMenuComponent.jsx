import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavbarMenuComponent = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera i dati utente dal localStorage al montaggio del componente
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Rimuovi token e dati utente
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">My Fanta Team</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                <span><i className="bi bi-house-door"> Dashboard</i></span></Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  <span><i className="bi bi-person-dash"> Logout</i></span>
                </Nav.Link>
                <Navbar.Text className="ms-3">
                  <span><i className="bi bi-person-check-fill"> Benvenuto, {user.username}</i></span>
                </Navbar.Text>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                <span><i className="bi bi-person-check"> Login</i></span>
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                <span><i className="bi bi-person-add"> Registrati</i></span></Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarMenuComponent;