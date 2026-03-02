package com.dea.ecommerce.user;

import com.dea.ecommerce.user.dto.ChangePasswordRequest;
import com.dea.ecommerce.user.dto.UpdateProfileRequest;
import com.dea.ecommerce.user.dto.UserProfileResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getProfileImageUrl()
        );
    }

    public UserProfileResponse updateMyProfile(String email, UpdateProfileRequest req) {
        User user = userRepository.findByEmail(email).orElseThrow();

        user.setName(req.getName());
        user.setPhone(req.getPhone());
        user.setProfileImageUrl(req.getProfileImageUrl());

        userRepository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getProfileImageUrl()
        );
    }

    public String changePassword(String email, ChangePasswordRequest req) {
        User user = userRepository.findByEmail(email).orElseThrow();

        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully";
    }
}