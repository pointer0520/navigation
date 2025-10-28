package com.navigation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 认证响应DTO
 */
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String username;
    private String email;
}
