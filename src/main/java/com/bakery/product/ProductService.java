package com.bakery.product;

import com.bakery.product.dto.CreateProductRequest;
import com.bakery.product.dto.ProductResponse;
import com.bakery.product.dto.UpdateProductRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAllActiveProducts() {
        return productRepository.findAllByActiveTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse createProduct(CreateProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(Category.valueOf(request.getCategory()))
                .imageUrl(request.getImageUrl())
                .build();

        return toResponse(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getCategory() != null) product.setCategory(Category.valueOf(request.getCategory()));
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());

        return toResponse(productRepository.save(product));
    }

    public void deactivateProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setActive(false);
        productRepository.save(product);
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory(),
                product.getImageUrl(),
                product.isActive(),
                product.getCreatedAt()
        );
    }
}