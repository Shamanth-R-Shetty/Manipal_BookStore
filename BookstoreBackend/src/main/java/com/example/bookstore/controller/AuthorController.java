package com.example.bookstore.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import com.example.bookstore.model.Book;
import com.example.bookstore.model.Author;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.repository.AuthorRepository;
import java.io.File;
import java.io.IOException;
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
    public Book addBook(@PathVariable Long authorId, @RequestBody Book book) {
         Optional<Author> optionalAuthor = authorRepository.findById(authorId);
         if (optionalAuthor.isPresent()) {
             Author author = optionalAuthor.get();
             book.setAuthor(author);
             book.setAuthorName(author.getName());
             return bookRepository.save(book);
         }
         return null;
    }

    @PostMapping(value = "/books/multipart/{authorId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Book addBookWithImage(@PathVariable Long authorId,
                                 @RequestParam("title") String title,
                                 @RequestParam("genre") String genre,
                                 @RequestParam("rating") double rating,
                                 @RequestParam("price") double price,
                                 @RequestParam("description") String description,
                                 @RequestParam("image") MultipartFile image) {
        Book book = new Book();
        Optional<Author> optionalAuthor = authorRepository.findById(authorId);
        if (optionalAuthor.isPresent()){
            Author author = optionalAuthor.get();
            book.setAuthor(author);
            book.setAuthorName(author.getName());
        }
        book.setTitle(title);
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
        
        return bookRepository.save(book);
    }

    @DeleteMapping("/books/{authorId}/{bookId}")
    public void deleteBook(@PathVariable Long authorId, @PathVariable Long bookId) {
         Optional<Book> optionalBook = bookRepository.findById(bookId);
         if (optionalBook.isPresent()) {
             Book book = optionalBook.get();
             if (book.getAuthor() != null && book.getAuthor().getId().equals(authorId)) {
                 bookRepository.deleteById(bookId);
             }
         }
    }

    @GetMapping("/{authorId}/books")
    public List<Book> getAuthorBooks(@PathVariable Long authorId) {
         Optional<Author> optionalAuthor = authorRepository.findById(authorId);
         if (optionalAuthor.isPresent()) {
             Author author = optionalAuthor.get();
             return bookRepository.findByAuthor(author);
         }
         return null;
    }
}
