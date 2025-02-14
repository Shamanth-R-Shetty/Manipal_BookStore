package com.example.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.bookstore.model.Author;
import java.util.Optional;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    Optional<Author> findByUsername(String username);
}
