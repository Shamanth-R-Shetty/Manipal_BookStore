import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Form, ListGroup } from 'react-bootstrap';
import './UserDashboard.css';

const UserDashboard = () => {
  const [view, setView] = useState('books');
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showGenreSidebar, setShowGenreSidebar] = useState(false);
  // New language state; 'en' for English and 'kn' for Kannada.
  const [language, setLanguage] = useState('en');

  // Translation dictionary for static texts.
  // (Note: The title is intentionally not used here so it remains in English.)
  const translations = {
    kn: {
      searchPlaceholder: "ಪುಸ್ತಕಗಳನ್ನು ಹುಡುಕಿ...",
      searchButton: "ಹುಡುಕಿ",
      cartButton: "ಕಾರ್ಟ್",
      browseByGenre: "ಶೈಲಿಗಳ ಮೂಲಕ ಬ್ರೌಸ್",
      genres: {
        "All Books": "ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು",
        "Fantasy": "ಕಾಲ್ಪನಿಕ",
        "Science Fiction": "ವಿಜ್ಞಾನ ಕಲ್ಪನೆ",
        "Mystery": "ರಹಸ್ಯ",
        "Romance": "ರೋಮ್ಯಾಂಟಿಕ್",
        "Historical Fiction": "ಐತಿಹಾಸಿಕ ಕತೆ",
        "Thriller": "ಥ್ರಿಲ್ಲರ್",
        "Horror": "ಭಯಾನಕ",
        "Non-fiction": "ನಾನ್-ಫಿಕ್ಷನ್",
        "Young Adult (YA)": "ಯುವ ವಯಸ್ಕರು (YA)",
        "Self-Help": "ಸ್ವ-ಸಹಾಯ"
      },
      modal: {
        author: "ಲೇಖಕ:",
        genre: "ಶೈಲಿ:",
        rating: "ರೇಟಿಂಗ್:",
        price: "ಬೆಲೆ:",
        description: "ವಿವರಣೆ:",
        addToCart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
        close: "ಮುಚ್ಚಿ"
      },
      cart: {
        title: "ನನ್ನ ಕಾರ್ಟ್",
        remove: "ತೆಗೆದುಹಾಕಿ",
        total: "ಒಟ್ಟು",
        proceedToPurchase: "ಖರೀದಿಗೆ ಮುಂದುವರೆಯಿರಿ"
      },
      // Other static labels for cards
      by: "ಲೇಖಕರು:",
      ratingLabel: "ರೇಟಿಂಗ್:",
      priceLabel: "ಬೆಲೆ:",
      genresHeading: "ಶೈಲಿಗಳು"
    }
  };

  // List of genre keys (always in English) used for filtering.
  const genreValues = [
    'All Books',
    'Fantasy',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Historical Fiction',
    'Thriller',
    'Horror',
    'Non-fiction',
    'Young Adult (YA)',
    'Self-Help'
  ];

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchBooks = () => {
    axios.get('http://localhost:8080/api/user/books')
      .then(response => setBooks(response.data))
      .catch(err => console.error(err));
  };

  const fetchCart = () => {
    axios.get(`http://localhost:8080/api/user/${user.id}/cart`)
      .then(response => setCartItems(response.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBooks();
    fetchCart();
  }, []);

  const handleSearch = () => {
    axios.get(`http://localhost:8080/api/user/books/search?q=${search}`)
      .then(response => setBooks(response.data))
      .catch(err => console.error(err));
  };

  const handleGenreFilter = (genre) => {
    setShowGenreSidebar(false);
    if (genre === 'All Books') {
      fetchBooks();
    } else {
      axios.get(`http://localhost:8080/api/user/books/genre?genre=${genre}`)
        .then(response => setBooks(response.data))
        .catch(err => console.error(err));
    }
  };

  const addToCart = (bookId) => {
    axios.post(`http://localhost:8080/api/user/${user.id}/cart`, { bookId, quantity: 1 })
      .then(() => fetchCart())
      .catch(err => console.error(err));
  };

  const removeFromCart = (cartItemId) => {
    axios.delete(`http://localhost:8080/api/user/${user.id}/cart/${cartItemId}`)
      .then(() => fetchCart())
      .catch(err => console.error(err));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      if (item.book && item.book.price) {
        return sum + item.book.price * item.quantity;
      }
      return sum;
    }, 0).toFixed(2);
  };

  return (
    <Container className="my-4 bookstore-container">
      <header className="bookstore-header d-flex align-items-center justify-content-between">
        <div className="logo-container">
          {/* Replacing the title with an image */}
          <img
            src="https://mcmscache.epapr.in/post_images/website_132/new_post_images/5fbb8edc8f352_UD-50yrs-logo-web.png"
            alt="Logo"
            className="bookstore-logo"
            style={{ maxHeight: '80px' }} // Adjust the size as needed
          />
        </div>
        <div className="header-right d-flex align-items-center">
          <Form.Control
            type="text"
            className="bookstore-search me-2"
            placeholder={language === 'kn' ? translations.kn.searchPlaceholder : 'Search books...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="primary" className="search-button me-2" onClick={handleSearch}>
            {language === 'kn' ? translations.kn.searchButton : 'Search'}
          </Button>
          {/* Translate button styled as primary and always showing English text */}
          <Button
            variant="primary"
            className="translate-button me-2"
            onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
          >
            {language === 'en' ? "Translate to Kannada" : "Translate to English"}
          </Button>
          <Button variant="primary" className="cart-button" onClick={() => setView('cart')}>
            <i className="fas fa-shopping-cart"></i> {language === 'kn' ? translations.kn.cartButton : 'Cart'}
          </Button>
        </div>
      </header>

      {view === 'books' && (
        <>
          <Row className="mb-3">
            <Col>
              <Button
                variant="outline-dark"
                className="genre-button"
                onClick={() => setShowGenreSidebar(!showGenreSidebar)}
              >
                {language === 'kn' ? translations.kn.browseByGenre : 'Browse by Genre'}
              </Button>
            </Col>
          </Row>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {books.map((book, idx) => (
              <Col key={idx}>
                <Card className="book-card h-100" onClick={() => setSelectedBook(book)}>
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
                      {language === 'kn' ? translations.kn.by : "By:"} {book.authorName}
                    </Card.Text>
                    <Card.Text className="mb-1">
                      {language === 'kn' ? translations.kn.ratingLabel : "Rating:"} {book.rating}
                    </Card.Text>
                    <Card.Text className="mt-auto">
                      {language === 'kn' ? translations.kn.priceLabel : "Price:"} ${book.price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {selectedBook && (
            <Modal show onHide={() => setSelectedBook(null)} className="custom-modal" centered>
              <Modal.Header closeButton>
                <Modal.Title>{selectedBook.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedBook.image && (
                  <img
                    src={`http://localhost:8080/${selectedBook.image}`}
                    alt={selectedBook.title}
                    className="img-fluid mb-3"
                  />
                )}
                <p>
                  <strong>
                    {language === 'kn' ? translations.kn.modal.author : "Author:"}
                  </strong>{" "}
                  {selectedBook.authorName}
                </p>
                <p>
                  <strong>
                    {language === 'kn' ? translations.kn.modal.genre : "Genre:"}
                  </strong>{" "}
                  {selectedBook.genre}
                </p>
                <p>
                  <strong>
                    {language === 'kn' ? translations.kn.modal.rating : "Rating:"}
                  </strong>{" "}
                  {selectedBook.rating}
                </p>
                <p>
                  <strong>
                    {language === 'kn' ? translations.kn.modal.price : "Price:"}
                  </strong>{" "}
                  ${selectedBook.price}
                </p>
                <p>
                  <strong>
                    {language === 'kn' ? translations.kn.modal.description : "Description:"}
                  </strong>{" "}
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
                  {language === 'kn' ? translations.kn.modal.addToCart : "Add to Cart"}
                </Button>
                <Button variant="secondary" onClick={() => setSelectedBook(null)}>
                  {language === 'kn' ? translations.kn.modal.close : "Close"}
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      )}

      {view === 'cart' && (
        <>
          <h3 className="mb-3">
            {language === 'kn' ? translations.kn.cart.title : "My Cart"}
          </h3>
          <ListGroup className="mb-3">
            {cartItems.map((item, idx) => (
              <ListGroup.Item
                key={idx}
                className="d-flex justify-content-between align-items-center"
              >
                {item.book
                  ? `${item.book.title} - $${item.book.price} x ${item.quantity}`
                  : 'Unknown Book'}
                <Button variant="danger" onClick={() => removeFromCart(item.id)}>
                  {language === 'kn' ? translations.kn.cart.remove : "Remove"}
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <h4>
            {language === 'kn' ? translations.kn.cart.total : "Total"}: ${calculateTotal()}
          </h4>
          <Button
            variant="success"
            onClick={() =>
              alert(
                language === 'kn'
                  ? "ಖರೀದಿಗೆ ಮುಂದುವರೆಯಲಾಗುತ್ತಿದೆ..."
                  : "Proceeding to purchase..."
              )
            }
          >
            {language === 'kn'
              ? translations.kn.cart.proceedToPurchase
              : "Proceed to Purchase"}
          </Button>
        </>
      )}

      {showGenreSidebar && (
        <aside className="genre-sidebar">
          <h4>
            {language === 'kn'
              ? translations.kn.genresHeading
              : "Genres"}
          </h4>
          <ul>
            {genreValues.map((genre) => (
              <li key={genre} onClick={() => handleGenreFilter(genre)}>
                {language === 'kn'
                  ? translations.kn.genres[genre]
                  : genre}
              </li>
            ))}
          </ul>
        </aside>
      )}
    </Container>
  );
};

export default UserDashboard;
