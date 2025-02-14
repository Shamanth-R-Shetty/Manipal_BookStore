import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./AuthorSignup.css";


const AuthorSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/auth/register/author", formData)
      .then((response) => {
        if (response.data.status === "success") {
          setMessage("Registration successful! Please log in.");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setMessage("Registration failed: " + response.data.error);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Registration failed.");
      });
  };

  return (
    <Container className="my-4">
      <h2>Author Registration</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Register as Author
        </Button>
      </Form>
    </Container>
  );
};

export default AuthorSignup;
