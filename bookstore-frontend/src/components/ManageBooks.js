import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageBooks.css";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    genre: "",
    rating: 0,
    price: 0,
    description: "",
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchBooks = () => {
    axios.get("http://localhost:8080/api/admin/books")
      .then((response) => {
        setBooks(response.data);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const multipartData = new FormData();
      Object.keys(formData).forEach((key) => multipartData.append(key, formData[key]));
      multipartData.append("image", file);

      axios.post("http://localhost:8080/api/admin/books/multipart", multipartData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(() => {
          fetchBooks();
          resetForm();
        })
        .catch((err) => console.error(err));
    } else {
      axios.post("http://localhost:8080/api/admin/books", formData)
        .then(() => {
          fetchBooks();
          resetForm();
        });
    }
  };

  const resetForm = () => {
    setFormData({ title: "", authorName: "", genre: "", rating: 0, price: 0, description: "" });
    setFile(null);
    setEditingId(null);
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      authorName: book.authorName,
      genre: book.genre,
      rating: book.rating,
      price: book.price,
      description: book.description,
    });
    setFile(null);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/admin/books/${id}`)
      .then(() => {
        fetchBooks();
      });
  };

  return (
    <div className="manage-books">
      <h3>Manage Books</h3>
      <form className="book-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author Name"
          value={formData.authorName}
          onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
          required
        />
        {/* Genre Dropdown */}
        <select
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          required
        >
          <option value="">Select Genre</option>
          <option value="All Books">All Books</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Mystery">Mystery</option>
          <option value="Romance">Romance</option>
          <option value="Historical Fiction">Historical Fiction</option>
          <option value="Thriller">Thriller</option>
          <option value="Horror">Horror</option>
          <option value="Non-fiction">Non-fiction</option>
          <option value="Young Adult (YA)">Young Adult (YA)</option>
          <option value="Self-Help">Self-Help</option>
        </select>
        <input
          type="number"
          step="0.1"
          placeholder="Rating"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        ></textarea>
        <div>
          <label>Select Image: </label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button type="submit">{editingId ? "Update Book" : "Add Book"}</button>
      </form>
      <hr />
      <h4>Book List</h4>
      <div className="book-list">
        {books.map((book) => (
          <div className="book-card" key={book.id}>
            {book.image && (
              <img
                src={`http://localhost:8080/${book.image}`}
                alt={book.title}
                className="book-image"
              />
            )}
            <h4>{book.title}</h4>
            <p>By: {book.authorName}</p>
            <p>Rating: {book.rating}</p>
            <p>Price: ${book.price}</p>
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBooks;
