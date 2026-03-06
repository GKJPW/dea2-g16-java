package com.dea.ecommerce.controller;

import com.dea.ecommerce.entity.Notification;
import com.dea.ecommerce.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Notification> create(@RequestBody Notification notification) {
        return new ResponseEntity<>(notificationService.createNotification(notification), HttpStatus.CREATED);
    }

    @GetMapping("/{recipient}")
    public ResponseEntity<List<Notification>> getByRecipient(@PathVariable String recipient) {
        return new ResponseEntity<>(notificationService.getNotifications(recipient), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return new ResponseEntity<>("Deleted", HttpStatus.OK);
    }

    @DeleteMapping("/clear/{recipient}")
    public ResponseEntity<String> clearAll(@PathVariable String recipient) {
        notificationService.clearAll(recipient);
        return new ResponseEntity<>("Cleared all", HttpStatus.OK);
    }
}