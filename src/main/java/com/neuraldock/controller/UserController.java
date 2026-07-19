package com.neuraldock.controller;

import com.neuraldock.dto.UserDTO;
import com.neuraldock.service.SaveResult;
import com.neuraldock.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/")
    public String index() {
        return "redirect:/home";
    }

    @GetMapping("/home")
    public String home() {
        return "home";
    }

    @GetMapping("/roadmap")
    public String roadmap() {
        return "roadmap";
    }

    @GetMapping("/blog")
    public String blog() {
        return "blog";
    }

    @GetMapping("/about")
    public String about() {
        return "about";
    }

    @GetMapping("/privacy")
    public String privacy() {
        return "privacy";
    }

    @GetMapping("/terms")
    public String terms() {
        return "terms";
    }

    @PostMapping("/home/user")
    @ResponseBody
    public ResponseEntity<String> saveUser(@ModelAttribute UserDTO userDTO) {
        SaveResult result = userService.save(userDTO);

        return switch (result) {
            case CREATED -> ResponseEntity.status(HttpStatus.CREATED).body("You're on the waitlist.");
            case DUPLICATE -> ResponseEntity.status(HttpStatus.CONFLICT).body("This email is already registered.");
            case INVALID -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter a valid email.");
        };
    }
}
