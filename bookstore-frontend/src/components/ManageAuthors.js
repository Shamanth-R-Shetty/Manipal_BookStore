import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import './ManageAuthors.css';


const ManageAuthors = () => {
   const [authors, setAuthors] = useState([]);
   const [formData, setFormData] = useState({ name: '', username: '', password: '' });
   const [editingId, setEditingId] = useState(null);

   const fetchAuthors = () => {
       axios.get('http://localhost:8080/api/admin/authors')
       .then(response => {
           const data = Array.isArray(response.data) ? response.data : [];
           setAuthors(data);
       })
       .catch(err => console.error(err));
   };

   useEffect(() => {
       fetchAuthors();
   }, []);

   const handleSubmit = (e) => {
       e.preventDefault();
       if (editingId) {
           axios.put(`http://localhost:8080/api/admin/authors/${editingId}`, formData)
           .then(() => {
               fetchAuthors();
               setEditingId(null);
               setFormData({ name: '', username: '', password: '' });
           })
           .catch(err => console.error(err));
       } else {
           axios.post('http://localhost:8080/api/admin/authors', formData)
           .then(() => {
               fetchAuthors();
               setFormData({ name: '', username: '', password: '' });
           })
           .catch(err => console.error(err));
       }
   };

   const handleEdit = (author) => {
       setEditingId(author.id);
       setFormData({ name: author.name, username: author.username, password: author.password });
   };

   const handleDelete = (id) => {
       axios.delete(`http://localhost:8080/api/admin/authors/${id}`)
       .then(() => {
           fetchAuthors();
       })
       .catch(err => console.error(err));
   };

   return (
       <Container>
          <h3>Manage Authors</h3>
          <Form onSubmit={handleSubmit}>
              <Form.Group>
                 <Form.Control type="text" placeholder="Name" value={formData.name} 
                               onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </Form.Group>
              <Form.Group>
                 <Form.Control type="text" placeholder="Username" value={formData.username} 
                               onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
              </Form.Group>
              <Form.Group>
                 <Form.Control type="password" placeholder="Password" value={formData.password} 
                               onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                  {editingId ? 'Update Author' : 'Add Author'}
              </Button>
          </Form>
          <hr />
          <h4>Author List</h4>
          <ListGroup>
             {authors.map(author => (
                <ListGroup.Item key={author.id} className="d-flex justify-content-between align-items-center">
                   {author.name} ({author.username})
                   <div>
                     <Button variant="warning" size="sm" onClick={() => handleEdit(author)} className="me-2">Edit</Button>
                     <Button variant="danger" size="sm" onClick={() => handleDelete(author.id)}>Delete</Button>
                   </div>
                </ListGroup.Item>
             ))}
          </ListGroup>
       </Container>
   );
};

export default ManageAuthors;
