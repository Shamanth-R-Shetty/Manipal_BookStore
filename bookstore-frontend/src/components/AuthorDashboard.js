import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card, Tab, Nav } from "react-bootstrap";
import './AuthorDashboard.css';

const AuthorDashboard = () => {
  const [activeTab, setActiveTab] = useState("mybooks");
  const [allBooks, setAllBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    rating: 0,
    price: 0,
    description: "",
  });
  const [file, setFile] = useState(null);
  const author = JSON.parse(localStorage.getItem("author"));

  const fetchAllBooks = () => {
    axios.get("http://localhost:8080/api/author/books")
      .then((response) => setAllBooks(response.data))
      .catch((err) => console.error(err));
  };

  const fetchMyBooks = () => {
    axios.get(`http://localhost:8080/api/author/${author.id}/books`)
      .then((response) => setMyBooks(response.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAllBooks();
    fetchMyBooks();
  }, [author.id]);

  const handleAddBook = (e) => {
    e.preventDefault();
    if (file) {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("genre", formData.genre);
      data.append("rating", formData.rating);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("image", file);

      axios.post(`http://localhost:8080/api/author/books/multipart/${author.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(() => {
          fetchMyBooks();
          resetForm();
        })
        .catch((err) => console.error(err));
    } else {
      axios.post(`http://localhost:8080/api/author/books/${author.id}`, formData)
        .then(() => {
          fetchMyBooks();
          resetForm();
        })
        .catch((err) => console.error(err));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      genre: "",
      rating: 0,
      price: 0,
      description: "",
    });
    setFile(null);
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Author Dashboard</h2>
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="allbooks">View All Books</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="mybooks">My Books</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="addbook">Add New Book</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="allbooks">
                <Row>
                  {allBooks.map((book, idx) => (
                    <Col key={idx} md={4} className="mb-4">
                      <Card>
                        {book.image ? (
                          <Card.Img
                            variant="top"
                            src={`http://localhost:8080/${book.image}`}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{ height: "200px", backgroundColor: "#ccc" }}></div>
                        )}
                        <Card.Body>
                          <Card.Title>{book.title}</Card.Title>
                          <Card.Text>{book.genre}</Card.Text>
                          <Card.Text>Rating: {book.rating}</Card.Text>
                          <Card.Text>Price: ${book.price}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Tab.Pane>

              {/* <Tab.Pane eventKey="mybooks">
                <Row>
                  {myBooks.map((book, idx) => (
                    <Col key={idx} md={4} className="mb-4">
                      <Card>
                        <Card.Body>
                          <Card.Title>{book.title}</Card.Title>
                          <Card.Text>{book.genre}</Card.Text>
                          <Card.Text>Rating: {book.rating}</Card.Text>
                          <Card.Text>Price: ${book.price}</Card.Text>
                          <Button variant="danger" onClick={() => handleDeleteBook(book.id)}>
                            Delete
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Tab.Pane> */}

              <Tab.Pane eventKey="addbook">
                <h4>Add New Book</h4>
                <Form onSubmit={handleAddBook}>
                  <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter book title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="genre">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter genre"
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      placeholder="Enter book rating"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter book price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter book description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="image">
                    <Form.Label>Book Cover Image</Form.Label>
                    <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mt-3">
                    Add Book
                  </Button>
                </Form>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AuthorDashboard;
