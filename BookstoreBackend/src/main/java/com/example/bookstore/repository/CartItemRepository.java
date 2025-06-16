package com.example.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.bookstore.model.CartItem;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // ensure the Book is fetched in the same query
    @Query("SELECT ci FROM CartItem ci JOIN FETCH ci.book WHERE ci.user.id = :userId")
    List<CartItem> findByUserId(@Param("userId") Long userId);
}
