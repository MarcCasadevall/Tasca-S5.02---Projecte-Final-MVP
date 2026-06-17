package com.bakery.order;

import com.bakery.cart.CartItem;
import com.bakery.cart.CartItemRepository;
import com.bakery.order.dto.OrderResponse;
import com.bakery.order.dto.PlaceOrderRequest;
import com.bakery.order.dto.UpdateOrderStatusRequest;
import com.bakery.product.Product;
import com.bakery.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private Product product;
    private CartItem cartItem;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .name("Marc")
                .email("marc@test.com")
                .build();

        product = Product.builder()
                .id(1L)
                .name("Tarta de chocolate")
                .price(new BigDecimal("24.99"))
                .build();

        cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(2)
                .build();
    }

    @Test
    void placeOrder_createsOrderAndClearsCart() {
        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setFullName("Marc Casadevall");
        request.setDni("46949803H");
        request.setAddress("Carrer Major 1");
        request.setPaymentMethod(PaymentMethod.CASH);

        Order savedOrder = Order.builder()
                .id(1L)
                .user(user)
                .fullName("Marc Casadevall")
                .dni("46949803H")
                .address("Carrer Major 1")
                .paymentMethod(PaymentMethod.CASH)
                .status(OrderStatus.PENDING)
                .totalPrice(new BigDecimal("49.98"))
                .items(List.of(OrderItem.builder()
                        .product(product)
                        .quantity(2)
                        .unitPrice(new BigDecimal("24.99"))
                        .build()))
                .build();

        when(cartItemRepository.findByUser(user)).thenReturn(List.of(cartItem));
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        OrderResponse result = orderService.placeOrder(user, request);

        assertThat(result.getFullName()).isEqualTo("Marc Casadevall");
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PENDING);
        assertThat(result.getTotal()).isEqualByComparingTo(new BigDecimal("49.98"));
        assertThat(result.getItems()).hasSize(1);

        verify(cartItemRepository).deleteAll(List.of(cartItem));
    }

    @Test
    void placeOrder_throwsExceptionWhenCartIsEmpty() {
        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setFullName("Marc");
        request.setDni("46949803H");
        request.setAddress("Carrer Major 1");
        request.setPaymentMethod(PaymentMethod.CASH);

        when(cartItemRepository.findByUser(user)).thenReturn(List.of());

        assertThatThrownBy(() -> orderService.placeOrder(user, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("carrito está vacío");
    }

    @Test
    void getMyOrders_returnsOrdersForUser() {
        Order order = Order.builder()
                .id(1L)
                .user(user)
                .fullName("Marc")
                .dni("46949803H")
                .address("Carrer Major 1")
                .paymentMethod(PaymentMethod.CASH)
                .status(OrderStatus.PENDING)
                .totalPrice(new BigDecimal("24.99"))
                .items(List.of())
                .build();

        when(orderRepository.findByUserOrderByCreatedAtDesc(user)).thenReturn(List.of(order));

        List<OrderResponse> result = orderService.getMyOrders(user);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
    }

    @Test
    void updateOrderStatus_changesStatusCorrectly() {
        Order order = Order.builder()
                .id(1L)
                .user(user)
                .fullName("Marc")
                .dni("46949803H")
                .address("Carrer Major 1")
                .paymentMethod(PaymentMethod.CASH)
                .status(OrderStatus.PENDING)
                .totalPrice(new BigDecimal("24.99"))
                .items(List.of())
                .build();

        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
        request.setStatus(OrderStatus.CONFIRMED);

        Order updatedOrder = Order.builder()
                .id(1L)
                .user(user)
                .fullName("Marc")
                .dni("46949803H")
                .address("Carrer Major 1")
                .paymentMethod(PaymentMethod.CASH)
                .status(OrderStatus.CONFIRMED)
                .totalPrice(new BigDecimal("24.99"))
                .items(List.of())
                .build();

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(updatedOrder);

        OrderResponse result = orderService.updateOrderStatus(1L, request);

        assertThat(result.getStatus()).isEqualTo(OrderStatus.CONFIRMED);
    }

    @Test
    void updateOrderStatus_throwsExceptionWhenOrderNotFound() {
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
        request.setStatus(OrderStatus.CONFIRMED);

        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.updateOrderStatus(99L, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Order not found");
    }
}