package com.navigation.controller;

import com.navigation.dto.LoginRequest;
import com.navigation.dto.RegisterRequest;
import com.navigation.dto.AuthResponse;
import com.navigation.entity.mysql.User;
import com.navigation.service.UserService;
import com.navigation.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class  AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.register(
                    request.getUsername(),
                    request.getPassword(),
                    request.getEmail()
            );
            
            String token = jwtUtil.generateToken(user.getUsername());
            
            return ResponseEntity.ok(new AuthResponse(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return userService.findByUsername(request.getUsername())
                .filter(user -> userService.validatePassword(request.getPassword(), user.getPasswordHash()))
                .map(user -> {
                    userService.updateLastLoginTime(user.getId());
                    String token = jwtUtil.generateToken(user.getUsername());
                    
                    return ResponseEntity.ok(new AuthResponse(
                            token,
                            user.getId(),
                            user.getUsername(),
                            user.getEmail()
                    ));
                })
                .orElse(ResponseEntity.status(401).build());
    }

}
