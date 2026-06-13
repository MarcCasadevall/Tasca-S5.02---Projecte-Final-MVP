package com.bakery.order.dto;

import com.bakery.order.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceOrderRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String dni;

    @NotBlank
    private String address;

    @NotNull
    private PaymentMethod paymentMethod;
}