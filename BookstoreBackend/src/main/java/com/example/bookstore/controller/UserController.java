package com.example.bookstore.controller;

import org.springframework.web.bind.annotation.*;
import com.example.bookstore.model.Book;
import com.example.bookstore.model.CartItem;
import com.example.bookstore.model.User;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.repository.CartItemRepository;
import com.example.bookstore.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final BookRepository bookRepo;
    private final CartItemRepository cartItemRepo;
    private final UserRepository userRepo;

    public UserController(BookRepository bookRepo,
                          CartItemRepository cartItemRepo,
                          UserRepository userRepo) {
        this.bookRepo = bookRepo;
        this.cartItemRepo = cartItemRepo;
        this.userRepo = userRepo;
    }

    // ─── CART ───────────────────────────────────────────────────────────────────

    @GetMapping("/{userId}/cart")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long userId) {
        if (!userRepo.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        List<CartItem> cart = cartItemRepo.findByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/{userId}/cart")
    public ResponseEntity<List<CartItem>> addToCart(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> payload) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Long bookId = Long.valueOf(payload.get("bookId").toString());
        int qty     = Integer.parseInt(payload.get("quantity").toString());

        Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        // merge duplicates
        Optional<CartItem> existing = cartItemRepo.findByUserId(userId).stream()
            .filter(ci -> ci.getBook().getId().equals(bookId))
            .findFirst();

        if (existing.isPresent()) {
            CartItem ci = existing.get();
            ci.setQuantity(ci.getQuantity() + qty);
            cartItemRepo.save(ci);
        } else {
            CartItem ci = new CartItem();
            ci.setUser(user);
            ci.setBook(book);
            ci.setQuantity(qty);
            cartItemRepo.save(ci);
        }

        // return the freshly‑loaded cart
        List<CartItem> updated = cartItemRepo.findByUserId(userId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{userId}/cart/{cartItemId}")
    public ResponseEntity<List<CartItem>> removeFromCart(
            @PathVariable Long userId,
            @PathVariable Long cartItemId) {

        if (!userRepo.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        cartItemRepo.findById(cartItemId).ifPresent(ci -> {
            if (ci.getUser().getId().equals(userId)) {
                cartItemRepo.delete(ci);
            }
        });

        List<CartItem> updated = cartItemRepo.findByUserId(userId);
        return ResponseEntity.ok(updated);
    }

    // ─── BOOK ENDPOINTS (unchanged) ────────────────────────────────────────────

    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    @GetMapping("/books/search")
    public List<Book> searchBooks(@RequestParam("q") String keyword) {
        return bookRepo.findByTitleContaining(keyword);
    }

    @GetMapping("/books/genre")
    public List<Book> getBooksByGenre(@RequestParam("genre") String genre) {
        return bookRepo.findByGenre(genre);
    }

    @GetMapping("/books/{id}")
    public Book getBookDetails(@PathVariable Long id) {
        return bookRepo.findById(id).orElse(null);
    }
}
