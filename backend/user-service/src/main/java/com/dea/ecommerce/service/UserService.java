package com.dea.ecommerce.service;

import com.dea.ecommerce.entity.User;
import com.dea.ecommerce.repository.UserRepository;
import com.dea.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User createUser(User user) {
        // 🟢 Hash the password before saving!
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Default to USER role if none is provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        return userRepository.save(user);
    }

    // 🟢 NEW: Login Logic
    public String authenticateUser(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Verify the typed password matches the hashed database password
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return jwtUtil.generateToken(user); // Send back the JWT!
            }
        }
        return null; // Login failed
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}