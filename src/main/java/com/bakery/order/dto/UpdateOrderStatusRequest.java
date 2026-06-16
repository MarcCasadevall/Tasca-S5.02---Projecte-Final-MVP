package com.bakery.order.dto;

import com.bakery.order.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatusRequest {

    @NotNull
    private OrderStatus status;
}