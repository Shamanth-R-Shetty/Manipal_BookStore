import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import "./ManageUsers.css";


const ManageUsers = () => {
   const [users, setUsers] = useState([]);
   const [formData, setFormData] = useState({ name: '', username: '', password: '' });
   const [editingId, setEditingId] = useState(null);

   const fetchUsers = () => {
       axios.get('http://localhost:8080/api/admin/users')
       .then(response => {
           const data = Array.isArray(response.data) ? response.data : [];
           setUsers(data);
       })
       .catch(err => console.error(err));
   };

   useEffect(() => {
       fetchUsers();
   }, []);

   const handleSubmit = (e) => {
       e.preventDefault();
       if (editingId) {
           axios.put(`http://localhost:8080/api/admin/users/${editingId}`, formData)
           .then(() => {
               fetchUsers();
               setEditingId(null);
               setFormData({ name: '', username: '', password: '' });
           })
           .catch(err => console.error(err));
       } else {
           axios.post('http://localhost:8080/api/admin/users', formData)
           .then(() => {
               fetchUsers();
               setFormData({ name: '', username: '', password: '' });
           })
           .catch(err => console.error(err));
       }
   };

   const handleEdit = (user) => {
       setEditingId(user.id);
       setFormData({ name: user.name, username: user.username, password: user.password });
   };

   const handleDelete = (id) => {
       axios.delete(`http://localhost:8080/api/admin/users/${id}`)
       .then(() => {
           fetchUsers();
       })
       .catch(err => console.error(err));
   };

   return (
       <Container>
          <h3>Manage Users</h3>
          <Form onSubmit={handleSubmit}>
              <Form.Group>
                 <Form.Control type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </Form.Group>
              <Form.Group>
                 <Form.Control type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
              </Form.Group>
              <Form.Group>
                 <Form.Control type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                  {editingId ? 'Update User' : 'Add User'}
              </Button>
          </Form>
          <hr />
          <h4>User List</h4>
          <ListGroup>
             {users.map(user => (
                <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                   {user.name} ({user.username})
                   <div>
                     <Button variant="warning" size="sm" onClick={() => handleEdit(user)} className="me-2">Edit</Button>
                     <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
                   </div>
                </ListGroup.Item>
             ))}
          </ListGroup>
       </Container>
   );
};

export default ManageUsers;
