import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Card, InputGroup } from 'react-bootstrap';
import { API_URL } from '../config';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Errore durante la registrazione');
      }

      localStorage.setItem('token', data.token);
      navigate('/login');

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0 register-card text-white">
            <Card.Body>
              <div className="text-center mb-4">
                <i className="bi bi-person-plus text-primary" style={{ fontSize: '3rem' }}></i>
                <h3 className="mt-2">Crea un Account</h3>
                <p>Registrati per iniziare</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Inserisci un nome utente"
                    autoComplete="off"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Inserisci la tua email"
                    autoComplete="off"
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Crea una password"
                      autoComplete="new-password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>

                {/* Conferma Password */}
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Conferma Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Ripeti la password"
                      autoComplete="new-password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowConfirm(!showConfirm)}
                      type="button"
                    >
                      <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-2">
                  <i className="bi bi-person-check me-2"></i>Registrati
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>
                  Hai già un account?{' '}
                  <Button variant="link" className="p-0 text-primary" onClick={() => navigate('/login')}>
                    Accedi
                  </Button>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;