package com.example.bookstore.controller;

import org.springframework.web.bind.annotation.*;
import com.example.bookstore.model.Book;
import com.example.bookstore.model.CartItem;
import com.example.bookstore.model.User;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.repository.CartItemRepository;
import com.example.bookstore.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final BookRepository bookRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public UserController(BookRepository bookRepository,
                          CartItemRepository cartItemRepository,
                          UserRepository userRepository) {
         this.bookRepository = bookRepository;
         this.cartItemRepository = cartItemRepository;
         this.userRepository = userRepository;
    }

    @GetMapping("/books")
    public List<Book> getAllBooks() {
         return bookRepository.findAll();
    }

    @GetMapping("/books/search")
    public List<Book> searchBooks(@RequestParam("q") String keyword) {
         return bookRepository.findByTitleContaining(keyword);
    }

    @GetMapping("/books/genre")
    public List<Book> getBooksByGenre(@RequestParam("genre") String genre) {
         return bookRepository.findByGenre(genre);
    }

    @GetMapping("/books/{id}")
    public Book getBookDetails(@PathVariable Long id) {
         Optional<Book> optionalBook = bookRepository.findById(id);
         return optionalBook.orElse(null);
    }

    @GetMapping("/{userId}/cart")
    public List<CartItem> getCartItems(@PathVariable Long userId) {
         return cartItemRepository.findByUserId(userId);
    }

    // Expects payload: { "bookId": <id>, "quantity": <number> }
    @PostMapping("/{userId}/cart")
    public CartItem addToCart(@PathVariable Long userId, @RequestBody Map<String, Object> payload) {
         Optional<User> optionalUser = userRepository.findById(userId);
         if (optionalUser.isPresent()) {
             User user = optionalUser.get();
             Long bookId = Long.valueOf(payload.get("bookId").toString());
             int quantity = Integer.valueOf(payload.get("quantity").toString());
             Optional<Book> optionalBook = bookRepository.findById(bookId);
             if (optionalBook.isPresent()) {
                 CartItem cartItem = new CartItem();
                 cartItem.setUser(user);
                 cartItem.setBook(optionalBook.get());
                 cartItem.setQuantity(quantity);
                 return cartItemRepository.save(cartItem);
             }
         }
         return null;
    }

    @DeleteMapping("/{userId}/cart/{cartItemId}")
    public void removeFromCart(@PathVariable Long userId, @PathVariable Long cartItemId) {
         Optional<CartItem> optionalCartItem = cartItemRepository.findById(cartItemId);
         if (optionalCartItem.isPresent()) {
             CartItem cartItem = optionalCartItem.get();
             if (cartItem.getUser().getId().equals(userId)) {
                 cartItemRepository.deleteById(cartItemId);
             }
         }
    }
}
