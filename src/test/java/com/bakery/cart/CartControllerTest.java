package com.bakery.cart;

import com.bakery.product.Category;
import com.bakery.product.Product;
import com.bakery.product.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    private String customerToken;
    private Long productId;

    @BeforeEach
    void setUp() throws Exception {
        Product product = productRepository.save(Product.builder()
                .name("Tarta de chocolate")
                .description("Deliciosa tarta")
                .price(new BigDecimal("24.99"))
                .category(Category.CAKES)
                .active(true)
                .build());
        productId = product.getId();

        Map<String, String> registerRequest = Map.of(
                "name", "Cart User",
                "email", "cartuser@test.com",
                "password", "password123"
        );

        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        customerToken = objectMapper.readTree(response).get("token").asText();
    }

    @Test
    void getCart_returnsEmptyListForNewUser() throws Exception {
        mockMvc.perform(get("/api/cart")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getCart_returnsUnauthorizedWithoutToken() throws Exception {
        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isForbidden());
    }

    @Test
    void addToCart_returnsCartItemWhenProductExists() throws Exception {
        Map<String, Object> request = Map.of(
                "productId", productId,
                "quantity", 2
        );

        mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(2))
                .andExpect(jsonPath("$.productName").value("Tarta de chocolate"));
    }

    @Test
    void addToCart_returnsBadRequestWithoutBody() throws Exception {
        mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}