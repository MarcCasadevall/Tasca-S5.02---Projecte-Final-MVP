package com.bakery.cart;

import com.bakery.cart.dto.AddToCartRequest;
import com.bakery.cart.dto.CartItemResponse;
import com.bakery.cart.dto.UpdateCartItemRequest;
import com.bakery.product.Product;
import com.bakery.product.ProductRepository;
import com.bakery.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public List<CartItemResponse> getCart(User user) {
        return cartItemRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CartItemResponse addToCart(User user, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository
                .findByUserAndProduct(user, product)
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return existing;
                })
                .orElse(CartItem.builder()
                        .user(user)
                        .product(product)
                        .quantity(request.getQuantity())
                        .build());

        return toResponse(cartItemRepository.save(cartItem));
    }

    public CartItemResponse updateQuantity(User user, Long productId, UpdateCartItemRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        cartItem.setQuantity(request.getQuantity());
        return toResponse(cartItemRepository.save(cartItem));
    }

    @Transactional
    public void removeFromCart(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        cartItemRepository.deleteByUserAndProduct(user, product);
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteAll(cartItemRepository.findByUser(user));
    }

    private CartItemResponse toResponse(CartItem item) {
        BigDecimal subtotal = item.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemResponse(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImageUrl(),
                item.getProduct().getPrice(),
                item.getQuantity(),
                subtotal
        );
    }
}