package com.example.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.bookstore.model.CartItem;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
}
