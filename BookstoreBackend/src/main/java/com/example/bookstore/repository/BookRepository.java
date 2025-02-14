package com.example.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.bookstore.model.Book;
import com.example.bookstore.model.Author;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByGenre(String genre);
    List<Book> findByTitleContaining(String keyword);
    List<Book> findByAuthor(Author author);
}
