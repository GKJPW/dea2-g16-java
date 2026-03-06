package com.dea.ecommerce.user;

import com.dea.ecommerce.user.dto.ChangePasswordRequest;
import com.dea.ecommerce.user.dto.UpdateProfileRequest;
import com.dea.ecommerce.user.dto.UserProfileResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserProfileResponse> myProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.getMyProfile(email));
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest req,
                                                             Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.updateMyProfile(email, req));
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest req,
                                                 Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.changePassword(email, req));
    }
}