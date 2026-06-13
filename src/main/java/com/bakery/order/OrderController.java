package com.bakery.order;

import com.bakery.order.dto.OrderResponse;
import com.bakery.order.dto.PlaceOrderRequest;
import com.bakery.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PlaceOrderRequest request
    ) {
        return ResponseEntity.ok(orderService.placeOrder(user, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(orderService.getMyOrders(user));
    }
}