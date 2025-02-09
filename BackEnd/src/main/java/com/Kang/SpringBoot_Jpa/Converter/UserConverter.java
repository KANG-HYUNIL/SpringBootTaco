package com.Kang.SpringBoot_Jpa.Converter;

import com.Kang.SpringBoot_Jpa.dto.SignUpDTO;
import com.Kang.SpringBoot_Jpa.dto.UserDTO;
import com.Kang.SpringBoot_Jpa.entity.UserEntity;

public class UserConverter {

    public static UserEntity toEntity(UserDTO userDTO)
    {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(userDTO.getId());
        userEntity.setPassword(userDTO.getPassword());
        userEntity.setName(userDTO.getName());
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setRole(userDTO.getRole());
        return userEntity;

    }

    public static UserDTO toDTO(UserEntity userEntity)
    {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(userEntity.getId());
        userDTO.setPassword(userEntity.getPassword());
        userDTO.setName(userEntity.getName());
        userDTO.setEmail(userEntity.getEmail());
        userDTO.setRole(userEntity.getRole());
        return userDTO;
    }

    public static UserDTO signUpDTOtoUserDTO(SignUpDTO signUpDTO)
    {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(signUpDTO.getId());
        userDTO.setPassword(signUpDTO.getPassword());
        userDTO.setName(signUpDTO.getName());
        userDTO.setEmail(signUpDTO.getEmail());
        userDTO.setRole(signUpDTO.getRole());
        return userDTO;
    }


}
