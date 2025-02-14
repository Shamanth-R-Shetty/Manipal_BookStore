package com.example.bookstore.model;

import jakarta.persistence.*;

@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String authorName;
    private String genre;
    
    // Explicit column definition so that Hibernate expects DECIMAL(3,1)
    @Column(columnDefinition = "DECIMAL(3,1)")
    private double rating;
    
    // Explicit column definition for price: DECIMAL(10,2)
    @Column(columnDefinition = "DECIMAL(10,2)")
    private double price;

    @Column(length = 1000)
    private String description;

    // This stores the relative path to the image (e.g., "uploads/filename.jpg")
    private String image;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    public Book() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public Author getAuthor() { return author; }
    public void setAuthor(Author author) { this.author = author; }
}