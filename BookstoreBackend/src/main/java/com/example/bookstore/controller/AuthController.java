package com.example.bookstore.controller;

import org.springframework.web.bind.annotation.*;
import com.example.bookstore.model.Author;
import com.example.bookstore.model.User;
import com.example.bookstore.repository.AuthorRepository;
import com.example.bookstore.repository.UserRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthorRepository authorRepository;
    private final UserRepository userRepository;

    public AuthController(AuthorRepository authorRepository, UserRepository userRepository) {
        this.authorRepository = authorRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/admin")
    public Map<String, Object> adminLogin(@RequestBody Map<String, String> credentials) {
         String username = credentials.get("username");
         String password = credentials.get("password");
         Map<String, Object> response = new HashMap<>();
         if ("admin@123".equals(username) && "123".equals(password)) {
             response.put("status", "success");
             response.put("role", "admin");
         } else {
             response.put("status", "fail");
         }
         return response;
    }

    @PostMapping("/author")
    public Map<String, Object> authorLogin(@RequestBody Map<String, String> credentials) {
         String username = credentials.get("username");
         String password = credentials.get("password");
         Map<String, Object> response = new HashMap<>();
         Optional<Author> authorOpt = authorRepository.findByUsername(username);
         if (authorOpt.isPresent() && authorOpt.get().getPassword().equals(password)) {
             response.put("status", "success");
             response.put("role", "author");
             response.put("author", authorOpt.get());
         } else {
             response.put("status", "fail");
         }
         return response;
    }

    @PostMapping("/user")
    public Map<String, Object> userLogin(@RequestBody Map<String, String> credentials) {
         String username = credentials.get("username");
         String password = credentials.get("password");
         Map<String, Object> response = new HashMap<>();
         Optional<User> userOpt = userRepository.findByUsername(username);
         if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
             response.put("status", "success");
             response.put("role", "user");
             response.put("user", userOpt.get());
         } else {
             response.put("status", "fail");
         }
         return response;
    }
    
    // Registration endpoints
    @PostMapping("/register/author")
    public Map<String, Object> registerAuthor(@RequestBody Author author) {
        Map<String, Object> response = new HashMap<>();
        try {
            Author saved = authorRepository.save(author);
            response.put("status", "success");
            response.put("author", saved);
        } catch(Exception e) {
            response.put("status", "fail");
            response.put("error", e.getMessage());
        }
        return response;
    }
    
    @PostMapping("/register/user")
    public Map<String, Object> registerUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            User saved = userRepository.save(user);
            response.put("status", "success");
            response.put("user", saved);
        } catch(Exception e) {
            response.put("status", "fail");
            response.put("error", e.getMessage());
        }
        return response;
    }
}
