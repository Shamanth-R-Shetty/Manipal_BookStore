import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import "./UserDashboard.css";

const PaymentModal = ({ show, onHide, amount, onSuccess }) => {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await simulatePayment();
      onSuccess();
      onHide();
    } catch (err) {
      console.error("Payment failed", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Payment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handlePayment}>
          <Form.Group className="mb-3">
            <Form.Label>Cardholder Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name on card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-between align-items-center">
            <h5>Total: ₹{amount}</h5>
            <Button variant="success" type="submit" disabled={processing}>
              {processing ? (
                <>
                  <Spinner animation="border" size="sm" /> Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const UserDashboard = () => {
  const [view, setView] = useState("books");
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showGenreSidebar, setShowGenreSidebar] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const translations = {
    kn: {
      searchButton: "ಹುಡುಕು",
      searchPlaceholder: "ಪುಸ್ತಕಗಳನ್ನು ಹುಡುಕಿ...",
      genres: {
        "All Books": "ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು",
        Fantasy: "ಕಲ್ಪನಾತ್ಮಕ ಕತೆ",
        "Science Fiction": "ವಿಜ್ಞಾನ ಕಾದಂಬರಿ",
        Mystery: "ರಹಸ್ಯ",
        "Historical Fiction": "ಐತಿಹಾಸಿಕ ಕಾದಂಬರಿ",
        Thriller: "ಥ್ರಿಲರ್",
        Horror: "ಭಯಾನಕ",
        "Self-Help": "ಸ್ವಯಂ ಸಹಾಯ",
      },
      genresHeading: "ಶೈಲಿಗಳು",
      browseByGenre: "ಶೈಲಿಗಳ ಮೂಲಕ ವೀಕ್ಷಿಸಿ",
      modal: {
        author: "ಲೇಖಕ:",
        genre: "ಶೈಲಿ:",
        rating: "ರೇಟಿಂಗ್:",
        price: "ಬೆಲೆ:",
        description: "ವಿವರಣೆ:",
        close: "ಮುಚ್ಚಿ",
        addToCart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
      },
      cart: {
        remove: "ತೆಗೆದುಹಾಕಿ",
        proceedToPurchase: "ಖರೀದಿಗೆ ಮುಂದುವರಿಸಿ",
        title: "ನನ್ನ ಕಾರ್ಟ್",
        total: "ಒಟ್ಟು",
      },
      by: "ಲೇಖಕ:",
      ratingLabel: "ರೇಟಿಂಗ್:",
      priceLabel: "ಬೆಲೆ:",
    },
  };

  const genreValues = [
    "All Books",
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Historical Fiction",
    "Thriller",
    "Horror",
    "Self-Help",
  ];

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBooks = () => {
    axios
      .get("http://localhost:8080/api/user/books")
      .then((response) => setBooks(response.data))
      .catch((err) => console.error(err));
  };

  const fetchCart = () => {
    axios
      .get(`http://localhost:8080/api/user/${user.id}/cart`)
      .then((response) => setCartItems(response.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBooks();
    fetchCart();
  }, []);

  const handleSearch = () => {
    axios
      .get(`http://localhost:8080/api/user/books/search?q=${search}`)
      .then((response) => setBooks(response.data))
      .catch((err) => console.error(err));
  };

  const handleGenreFilter = (genre) => {
    setShowGenreSidebar(false);
    if (genre === "All Books") {
      fetchBooks();
    } else {
      axios
        .get(`http://localhost:8080/api/user/books/genre?genre=${genre}`)
        .then((response) => setBooks(response.data))
        .catch((err) => console.error(err));
    }
  };

  const addToCart = (bookId) => {
    axios
      .post(`http://localhost:8080/api/user/${user.id}/cart`, {
        bookId,
        quantity: 1,
      })
      .then(() => fetchCart())
      .catch((err) => console.error(err));
  };

  const removeFromCart = (cartItemId) => {
    axios
      .delete(`http://localhost:8080/api/user/${user.id}/cart/${cartItemId}`)
      .then(() => fetchCart())
      .catch((err) => console.error(err));
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => {
        if (item.book && item.book.price) {
          return sum + item.book.price * item.quantity;
        }
        return sum;
      }, 0)
      .toFixed(2);
  };

  return (
    <Container className="my-4 bookstore-container">
      <header className="bookstore-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Button
            variant="primary"
            onClick={() => setShowChatbot(true)}
            className="me-2"
            style={{
              borderRadius: "20px",
              padding: "8px 16px",
              fontWeight: "bold",
            }}
          >
            Chat
          </Button>
          <div className="logo-container">
            <img
              src="https://mcmscache.epapr.in/post_images/website_132/new_post_images/5fbb8edc8f352_UD-50yrs-logo-web.png"
              alt="Logo"
              className="bookstore-logo"
              style={{ maxHeight: "80px" }}
            />
          </div>
        </div>
        <div className="header-right d-flex align-items-center">
          <Form.Control
            type="text"
            className="bookstore-search me-2"
            placeholder={
              language === "kn"
                ? translations.kn.searchPlaceholder
                : "Search books..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="primary"
            className="search-button me-2"
            onClick={handleSearch}
          >
            {language === "kn" ? translations.kn.searchButton : "Search"}
          </Button>
          <Button
            variant="primary"
            className="translate-button me-2"
            onClick={() => setLanguage(language === "en" ? "kn" : "en")}
          >
            {language === "en"
              ? "Translate to Kannada"
              : "Translate to English"}
          </Button>
          <Button
            variant="primary"
            className="cart-button"
            onClick={() => setView("cart")}
          >
            Cart
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowGenreSidebar(!showGenreSidebar)}
          >
            {language === "kn"
              ? translations.kn.browseByGenre
              : "Browse by Genre"}
          </Button>
        </div>
      </header>

      {view === "books" && (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {books.map((book, idx) => (
            <Col key={idx}>
              <Card
                className="book-card h-100"
                onClick={() => setSelectedBook(book)}
              >
                {book.image ? (
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8080/${book.image}`}
                    className="book-image"
                  />
                ) : (
                  <div className="book-image-placeholder">No Image</div>
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text className="mb-1">
                    {language === "kn" ? translations.kn.by : "By:"}{" "}
                    {book.authorName}
                  </Card.Text>
                  <Card.Text className="mb-1">
                    {language === "kn"
                      ? translations.kn.ratingLabel
                      : "Rating:"}{" "}
                    {book.rating}
                  </Card.Text>
                  <Card.Text className="mt-auto">
                    {language === "kn" ? translations.kn.priceLabel : "Price:"}{" "}
                    ₹{book.price}
                  </Card.Text>
                  <Button variant="primary" onClick={() => addToCart(book.id)}>
                    {language === "kn"
                      ? translations.kn.modal.addToCart
                      : "Add to Cart"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {selectedBook && (
        <Modal show={true} onHide={() => setSelectedBook(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedBook.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {language === "kn" ? translations.kn.modal.author : "Author:"}{" "}
              {selectedBook.authorName}
            </p>
            <p>
              {language === "kn" ? translations.kn.modal.genre : "Genre:"}{" "}
              {selectedBook.genre}
            </p>
            <p>
              {language === "kn" ? translations.kn.modal.rating : "Rating:"}{" "}
              {selectedBook.rating}
            </p>
            <p>
              {language === "kn" ? translations.kn.modal.price : "Price:"} ₹
              {selectedBook.price}
            </p>
            <p>
              {language === "kn"
                ? translations.kn.modal.description
                : "Description:"}{" "}
              {selectedBook.description}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                addToCart(selectedBook.id);
                setSelectedBook(null);
              }}
            >
              {language === "kn"
                ? translations.kn.modal.addToCart
                : "Add to Cart"}
            </Button>
            <Button variant="secondary" onClick={() => setSelectedBook(null)}>
              {language === "kn" ? translations.kn.modal.close : "Close"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {view === "cart" && (
        <>
          <h3 className="mb-3">
            {language === "kn" ? translations.kn.cart.title : "My Cart"}
          </h3>
          <ListGroup className="mb-3">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.id} className="cart-list-item">
                <div className="cart-item-details">
                  <strong>{item.book.title}</strong>
                  <span>
                    {" "}
                    - ₹{item.book.price} × {item.quantity}
                  </span>
                </div>
                <Button
                  variant="danger"
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  {language === "kn" ? translations.kn.cart.remove : "Remove"}
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <h4>
            {language === "kn" ? translations.kn.cart.total : "Total"}: ₹
            {calculateTotal()}
          </h4>
          <Button variant="success" onClick={() => setShowPaymentModal(true)}>
            {language === "kn"
              ? translations.kn.cart.proceedToPurchase
              : "Proceed to Purchase"}
          </Button>
        </>
      )}

      <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        amount={calculateTotal()}
        onSuccess={() =>
          alert("Payment Successful! Thank you for your purchase.")
        }
      />

      {showGenreSidebar && (
        <aside className="genre-sidebar">
          <h4>
            {language === "kn" ? translations.kn.genresHeading : "Genres"}
          </h4>
          <ul>
            {genreValues.map((genre) => (
              <li key={genre} onClick={() => handleGenreFilter(genre)}>
                {language === "kn"
                  ? translations.kn.genres[genre] || genre
                  : genre}
              </li>
            ))}
          </ul>
        </aside>
      )}

      <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </Container>
  );
};
const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Welcome to Udayavani e-book store. I am your reading partner. Ask any queries related to books and the company.',
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const apiKey = 'AIzaSyAtDKH3tCTrPHO9UwOPqE0FaS_319JArIc';
    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemInstruction = {
      parts: [
        {
          text:
            'You are a friendly chatbot for Udayavani e-book store. Your primary function is to assist users with queries related to books and the company. When a user asks about a book, provide accurate information if available; if not, generate a plausible and genuine-looking response as if the book exists. For queries unrelated to books or the company, politely inform the user that you can only assist with book-related queries. Maintain a friendly and entertaining tone in your responses.',
        },
      ],
    };

    const requestBody = {
      systemInstruction,
      contents: [...messages, userMessage].map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }],
      })),
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        const assistantMessage = data.candidates[0].content.parts[0].text;
        setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'No response from the model.' }]);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '350px',
        height: '500px',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '15px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '15px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h5 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>
          Chat with Reading Partner
        </h5>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onClose}
          style={{ borderRadius: '10px' }}
        >
          Close
        </Button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '15px',
          backgroundColor: '#f5f5f5',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: '15px',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: msg.role === 'user' ? '#007bff' : '#ffffff',
              color: msg.role === 'user' ? '#ffffff' : '#333',
              maxWidth: '80%',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <strong style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
              {msg.role === 'user' ? 'You' : 'Bot'}:
            </strong>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 15px',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#ffffff',
        }}
      >
        <Form.Control
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={{
            width: '70%',
            marginRight: '10px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            height: '40px',
            fontSize: '1rem',
            backgroundColor: '#fafafa',
          }}
        />
        <Button
          variant="primary"
          onClick={sendMessage}
          style={{
            width: '30%',
            padding: '0',
            borderRadius: '8px',
            fontSize: '0.9rem',
            height: '40px',
            lineHeight: '1',
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

const simulatePayment = () =>
new Promise((resolve) => setTimeout(resolve, 2000));

export default UserDashboard;
