import React, { useState } from "react";
import ManageBooks from "./ManageBooks";
import ManageUsers from "./ManageUsers";
import ManageAuthors from "./ManageAuthors";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [view, setView] = useState("books");

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <div className="button-group">
        <button className="dashboard-btn" onClick={() => setView("books")}>
          Manage Books
        </button>
        <button className="dashboard-btn" onClick={() => setView("users")}>
          Manage Users
        </button>
        <button className="dashboard-btn" onClick={() => setView("authors")}>
          Manage Authors
        </button>
      </div>
      <div className="dashboard-content">
        {view === "books" && <ManageBooks />}
        {view === "users" && <ManageUsers />}
        {view === "authors" && <ManageAuthors />}
      </div>
    </div>
  );
};

export default AdminDashboard;
