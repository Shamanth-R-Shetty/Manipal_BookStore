package com.example.bookstore.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import com.example.bookstore.model.Book;
import com.example.bookstore.model.Author;
import com.example.bookstore.model.User;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.repository.AuthorRepository;
import com.example.bookstore.repository.UserRepository;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final UserRepository userRepository;

    public AdminController(BookRepository bookRepository, AuthorRepository authorRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.userRepository = userRepository;
    }

    // --- Books Management ---
    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @PostMapping("/books")
    public Book addBook(@RequestBody Book book) {
        return bookRepository.save(book);
    }

    @PostMapping(value = "/books/multipart", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Book addBookWithImage(
            @RequestParam("title") String title,
            @RequestParam("authorName") String authorName,
            @RequestParam("genre") String genre,
            @RequestParam("rating") double rating,
            @RequestParam("price") double price,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "authorId", required = false) Long authorId) {

        Book book = new Book();
        book.setTitle(title);
        book.setAuthorName(authorName);
        book.setGenre(genre);
        book.setRating(rating);
        book.setPrice(price);
        book.setDescription(description);

        try {
            String uploadsDirPath = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
            File uploadsDir = new File(uploadsDirPath);
            if (!uploadsDir.exists()) {
                uploadsDir.mkdirs();
            }
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            File dest = new File(uploadsDirPath + fileName);
            image.transferTo(dest);
            book.setImage("uploads/" + fileName);
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (authorId != null) {
            Optional<Author> authorOpt = authorRepository.findById(authorId);
            if (authorOpt.isPresent()) {
                Author author = authorOpt.get();
                book.setAuthor(author);
                book.setAuthorName(author.getName());
            }
        }
        return bookRepository.save(book);
    }

    @PutMapping("/books/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (optionalBook.isPresent()) {
            Book book = optionalBook.get();
            book.setTitle(bookDetails.getTitle());
            book.setAuthorName(bookDetails.getAuthorName());
            book.setGenre(bookDetails.getGenre());
            book.setRating(bookDetails.getRating());
            book.setPrice(bookDetails.getPrice());
            book.setDescription(bookDetails.getDescription());
            book.setImage(bookDetails.getImage());
            return bookRepository.save(book);
        }
        return null;
    }

    @DeleteMapping("/books/{id}")
    public void deleteBook(@PathVariable Long id) {
         bookRepository.deleteById(id);
    }

    // --- Authors Management ---
    @GetMapping("/authors")
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    @PostMapping("/authors")
    public Author addAuthor(@RequestBody Author author) {
         return authorRepository.save(author);
    }

    @PutMapping("/authors/{id}")
    public Author updateAuthor(@PathVariable Long id, @RequestBody Author authorDetails) {
         Optional<Author> optionalAuthor = authorRepository.findById(id);
         if (optionalAuthor.isPresent()) {
             Author author = optionalAuthor.get();
             author.setName(authorDetails.getName());
             author.setUsername(authorDetails.getUsername());
             author.setPassword(authorDetails.getPassword());
             return authorRepository.save(author);
         }
         return null;
    }

    @DeleteMapping("/authors/{id}")
    public void deleteAuthor(@PathVariable Long id) {
         authorRepository.deleteById(id);
    }

    // --- Users Management ---
    @GetMapping("/users")
    public List<User> getAllUsers() {
         return userRepository.findAll();
    }

    @PostMapping("/users")
    public User addUser(@RequestBody User user) {
         return userRepository.save(user);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
         Optional<User> optionalUser = userRepository.findById(id);
         if (optionalUser.isPresent()) {
             User user = optionalUser.get();
             user.setName(userDetails.getName());
             user.setUsername(userDetails.getUsername());
             user.setPassword(userDetails.getPassword());
             return userRepository.save(user);
         }
         return null;
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
         userRepository.deleteById(id);
    }
}
