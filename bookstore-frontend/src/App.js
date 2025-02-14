import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AuthorDashboard from './components/AuthorDashboard';
import UserDashboard from './components/UserDashboard';
import AuthorSignup from './components/AuthorSignup';
import UserSignup from './components/UserSignup';
import './App.css'; // Centralized custom styles for modern UI design


function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/author" element={<AuthorDashboard />} />
         <Route path="/user" element={<UserDashboard />} />
         <Route path="/signup/author" element={<AuthorSignup />} />
         <Route path="/signup/user" element={<UserSignup />} />
      </Routes>
    </Router>
  );
}

export default App;
