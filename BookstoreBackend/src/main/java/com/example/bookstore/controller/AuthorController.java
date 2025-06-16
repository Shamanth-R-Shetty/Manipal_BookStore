package com.example.bookstore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.bookstore.model.Book;
import com.example.bookstore.model.Author;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.repository.AuthorRepository;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/author")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthorController {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    public AuthorController(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @PostMapping("/books/{authorId}")
    public ResponseEntity<Book> addBook(@PathVariable Long authorId, @RequestBody Book book) {
        Optional<Author> optionalAuthor = authorRepository.findById(authorId);
        if (optionalAuthor.isPresent()) {
            Author author = optionalAuthor.get();
            book.setAuthor(author);
            book.setAuthorName(author.getName());
            Book savedBook = bookRepository.save(book);
            return ResponseEntity.ok(savedBook);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping(value = "/books/multipart/{authorId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Book> addBookWithImage(
            @PathVariable Long authorId,
            @RequestParam("title") String title,
            @RequestParam("genre") String genre,
            @RequestParam("rating") double rating,
            @RequestParam("price") double price,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image) {
        Optional<Author> optionalAuthor = authorRepository.findById(authorId);
        if (!optionalAuthor.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        Author author = optionalAuthor.get();
        Book book = new Book();
        book.setAuthor(author);
        book.setAuthorName(author.getName());
        book.setTitle(title);
        book.setGenre(genre);
        book.setRating(rating);
        book.setPrice(price);
        book.setDescription(description);

        if (image != null && !image.isEmpty()) {
            try {
                String uploadsDirPath = "src/main/resources/static/uploads/";
                File dir = new File(uploadsDirPath);
                if (!dir.exists()) dir.mkdirs();
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                File dest = new File(uploadsDirPath + fileName);
                image.transferTo(dest);
                book.setImage("uploads/" + fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }

        Book savedBook = bookRepository.save(book);
        return ResponseEntity.ok(savedBook);
    }

    @GetMapping("/{authorId}/books")
    public List<Book> getAuthorBooks(@PathVariable Long authorId) {
        Optional<Author> optionalAuthor = authorRepository.findById(authorId);
        if (optionalAuthor.isPresent()) {
            Author author = optionalAuthor.get();
            return bookRepository.findByAuthor(author);
        }
        return Collections.emptyList();
    }
}