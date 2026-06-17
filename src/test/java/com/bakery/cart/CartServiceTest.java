package com.bakery.cart;

import com.bakery.cart.dto.AddToCartRequest;
import com.bakery.cart.dto.CartItemResponse;
import com.bakery.cart.dto.UpdateCartItemRequest;
import com.bakery.product.Product;
import com.bakery.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private com.bakery.product.ProductRepository productRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Product product;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@test.com")
                .build();

        product = Product.builder()
                .id(1L)
                .name("Tarta de chocolate")
                .price(new BigDecimal("24.99"))
                .build();
    }

    @Test
    void getCart_returnsItemsForUser() {
        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(2)
                .build();

        when(cartItemRepository.findByUser(user)).thenReturn(List.of(cartItem));

        List<CartItemResponse> result = cartService.getCart(user);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProductName()).isEqualTo("Tarta de chocolate");
        assertThat(result.get(0).getQuantity()).isEqualTo(2);
        assertThat(result.get(0).getSubtotal()).isEqualByComparingTo(new BigDecimal("49.98"));
    }

    @Test
    void getCart_returnsEmptyListWhenCartIsEmpty() {
        when(cartItemRepository.findByUser(user)).thenReturn(List.of());

        List<CartItemResponse> result = cartService.getCart(user);

        assertThat(result).isEmpty();
    }

    @Test
    void addToCart_createsNewItemWhenProductNotInCart() {
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(1L);
        request.setQuantity(3);

        CartItem savedItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(3)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserAndProduct(user, product)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(savedItem);

        CartItemResponse result = cartService.addToCart(user, request);

        assertThat(result.getQuantity()).isEqualTo(3);
        assertThat(result.getProductName()).isEqualTo("Tarta de chocolate");
    }

    @Test
    void addToCart_accumulatesQuantityWhenProductAlreadyInCart() {
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(1L);
        request.setQuantity(2);

        CartItem existingItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(3)
                .build();

        CartItem updatedItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(5)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserAndProduct(user, product)).thenReturn(Optional.of(existingItem));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(updatedItem);

        CartItemResponse result = cartService.addToCart(user, request);

        assertThat(result.getQuantity()).isEqualTo(5);
    }

    @Test
    void addToCart_throwsExceptionWhenProductNotFound() {
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(99L);
        request.setQuantity(1);

        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.addToCart(user, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Product not found");
    }

    @Test
    void updateQuantity_updatesCartItemQuantity() {
        UpdateCartItemRequest request = new UpdateCartItemRequest();
        request.setQuantity(5);

        CartItem existingItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(2)
                .build();

        CartItem updatedItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(5)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserAndProduct(user, product)).thenReturn(Optional.of(existingItem));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(updatedItem);

        CartItemResponse result = cartService.updateQuantity(user, 1L, request);

        assertThat(result.getQuantity()).isEqualTo(5);
    }

    @Test
    void removeFromCart_deletesCartItem() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        cartService.removeFromCart(user, 1L);

        verify(cartItemRepository).deleteByUserAndProduct(user, product);
    }
}