import React, { useState } from "react";
import axios from "axios";
import { Container, Button, Form, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
// You can still keep this import if you need the other styles
import "./Login.css";

const Login = () => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const payload = { username, password };

    if (role === "admin") {
      axios
        .post("http://localhost:8080/api/auth/admin", payload)
        .then((response) => {
          if (response.data.status === "success") {
            navigate("/admin");
          } else {
            setMessage("Invalid admin credentials");
          }
        })
        .catch(() => setMessage("Login failed"));
    } else if (role === "author") {
      axios
        .post("http://localhost:8080/api/auth/author", payload)
        .then((response) => {
          if (response.data.status === "success") {
            localStorage.setItem("author", JSON.stringify(response.data.author));
            navigate("/author");
          } else {
            setMessage("Invalid author credentials");
          }
        })
        .catch(() => setMessage("Login failed"));
    } else if (role === "user") {
      axios
        .post("http://localhost:8080/api/auth/user", payload)
        .then((response) => {
          if (response.data.status === "success") {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/user");
          } else {
            setMessage("Invalid user credentials");
          }
        })
        .catch(() => setMessage("Login failed"));
    } else {
      setMessage("Please select a role");
    }
  };

  return (
    <div className="login-page">
      {/* Background Image Covering Full Screen */}
      <div className="login-background">
        <img
          src="https://wallpapercave.com/wp/wp7485643.jpg"  /* Replace with your image path */
          alt="Decorative Background"
        />
      </div>

      <Container className="login-container">
        {/* Inline styling applied directly to the title */}
        <h2
          className="text-center"
          style={{
            fontFamily: "'Brush Script MT', cursive, sans-serif",
            fontSize: "2.5rem",
            color: "#8B4513", // Reddish brown shade
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            marginBottom: "20px",
          }}
        >
          Select Your Role to Login...
        </h2>
        {message && <Alert variant="danger">{message}</Alert>}
        <div className="login-card-container">
          <div className="login-card" onClick={() => setRole("admin")}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOJMs_aoeJy8uwPOUHWPRc8vV7k5NKprBdUQ&s"
              alt="Admin Icon"
              className="login-icon"
            />
            <h3>Admin Login</h3>
          </div>
          {/* <div className="login-card" onClick={() => setRole("author")}>
            <img
              src="https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-writer-line-icon-vector-png-image_6688962.png"
              alt="Author Icon"
              className="login-icon"
            />
            <h3>Author Login</h3>
          </div> */}
          <div className="login-card" onClick={() => setRole("user")}>
            <img
              src="https://cdn-icons-gif.flaticon.com/11255/11255995.gif"
              alt="User Icon"
              className="login-icon"
            />
            <h3>User Login</h3>
          </div>
        </div>
        {role && (
          <Form onSubmit={handleLogin} className="login-form">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="dark" type="submit" className="mt-3">
              Login as {role}
            </Button>
          </Form>
        )}
        {(role === "author" || role === "user") && (
          <div className="mt-3 text-center">
            <p>
              Don't have an account?{" "}
              {role === "author" ? (
                <Link to="/signup/author">Create Author Account</Link>
              ) : (
                <Link to="/signup/user">Create User Account</Link>
              )}
            </p>
          </div>
        )}
      </Container>

      {/* Only display the GIF when no role is selected */}
      {!role && (
        <div className="login-gif" style={{ textAlign: "center", marginTop: "20px" }}>
          <img
            src="https://zerodha.com/z-connect/wp-content/uploads/2014/02/Udayavani.gif" // or "/assets/my-gif.gif" if stored in a subfolder
            alt="Decorative GIF"
            style={{ width: "300px", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default Login;
