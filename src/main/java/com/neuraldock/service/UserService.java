package com.neuraldock.service;

import com.neuraldock.dto.UserDTO;

public interface UserService {
    SaveResult save(UserDTO userDTO);
}
