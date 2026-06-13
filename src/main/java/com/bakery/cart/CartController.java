package com.bakery.cart;

import com.bakery.cart.dto.AddToCartRequest;
import com.bakery.cart.dto.CartItemResponse;
import com.bakery.cart.dto.UpdateCartItemRequest;
import com.bakery.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/items")
    public ResponseEntity<CartItemResponse> addToCart(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(user, request));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartItemResponse> updateQuantity(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateQuantity(user, productId, request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId) {
        cartService.removeFromCart(user, productId);
        return ResponseEntity.noContent().build();
    }
}