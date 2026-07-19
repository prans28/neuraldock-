package com.neuraldock.service.impl;

import com.neuraldock.dto.UserDTO;
import com.neuraldock.entity.User_;
import com.neuraldock.repository.UserRepository;
import com.neuraldock.service.SaveResult;
import com.neuraldock.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public SaveResult save(UserDTO userDTO) {
        String email = userDTO.getEmail() == null ? null : userDTO.getEmail().trim();

        if (email == null || email.isEmpty()) {
            return SaveResult.INVALID;
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return SaveResult.DUPLICATE; // already on the waitlist — don't create a duplicate row
        }

        userRepository.save(User_.builder()
                .email(email)
                .build());

        return SaveResult.CREATED;
    }
}
