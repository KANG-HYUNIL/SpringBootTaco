package com.Kang.SpringBoot_Jpa.service;

import com.Kang.SpringBoot_Jpa.Converter.UserConverter;
import com.Kang.SpringBoot_Jpa.dto.SignUpDTO;
import com.Kang.SpringBoot_Jpa.dto.UserDTO;
import com.Kang.SpringBoot_Jpa.entity.UserEntity;
import com.Kang.SpringBoot_Jpa.exception.*;
import com.Kang.SpringBoot_Jpa.repository.UserRepository;

import com.Kang.SpringBoot_Jpa.utils.InputValidator;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {

    private final UserRepository userRepository; //UserRepository DI
    private final MemberService memberService; //MemberService DI
    private final BCryptPasswordEncoder bCryptPasswordEncoder; //BCryptPasswordEncoder DI
    //계정 관련 서비스

    //id와 password 유효성 검사
    private void checkValidate(String id, String password)
    {
        //id 혹은 password가 유효하지 않으면 false
        if (!InputValidator.isValid(id) || !InputValidator.isPasswordValid(password))
        {
            throw new InvalidInputException("Invalid id or password");
        }
    }

    //id 중복 검사
    private void checkIdExists(String id)
    {
        //id가 이미 존재하면 예외 처리
        if (userRepository.existsById(id))
        {
            throw new DuplicateDataException("ID already exists");
        }
    }

    //인증번호 검사
    private void checkAuthCode(String email, String authCode)
    {
        //인증번호가 null이거나 비어있으면 false
        if (authCode == null || authCode.isEmpty()) {
            throw new InvalidAuthCodeException("Empty authentication code");
        }
        
        //인증 시도
        memberService.verifyAuthCode(email, authCode);

    }

    //UserEntity 저장
    private void saveUser(UserDTO userDTO)
    {
        try{
            //UserDTO -> UserEntity 변환
            UserEntity userEntity = UserConverter.toEntity(userDTO);
            //UserEntity 저장
            userRepository.save(userEntity);
            log.info("Saved user :{}", userDTO);
        } catch (DataAccessException e)
        {
            log.error("Error saving user: {}. UserDTO: {}", e.getMessage(), userDTO, e);
            //저장 과정 중 에러 발생 시에 false
            throw new RuntimeException(e);
        }
    }

    //회원가입
    public void signUp(SignUpDTO signUpDTO)
    {
        signUpDTO.setRole("ROLE_ADMIN"); //회원가입 시 ROLE_ADMIN으로 설정 fixme

        //SignUpDTO -> UserDTO 변환
        UserDTO userDTO = UserConverter.signUpDTOtoUserDTO(signUpDTO);

        String authCode = signUpDTO.getAuthCode();

        //id password 유효성 검사
        checkValidate(userDTO.getId(), userDTO.getPassword());
        //id 중복 검사
        checkIdExists(userDTO.getId());
        //인증번호 검사
        checkAuthCode(userDTO.getEmail(), authCode);

        //비밀번호 암호화
        userDTO.setPassword(bCryptPasswordEncoder.encode(userDTO.getPassword()));

        //UserEntity 저장
        saveUser(userDTO);

        //회원가입 성공
    }

    //id로 UserEntity 가져오기
    public UserEntity getUserById(String id)
    {
        //id로 UserEntity 가져오기
        Optional<UserEntity> userEntity = userRepository.findById(id);
        //UserEntity가 존재하지 않으면 예외 처리
        if (userEntity.isEmpty())
        {
            throw new NoDataException("User id not found");
        }

        //UserEntity 반환
        return userEntity.get();
    }

    //name으로 UserEntity 가져오기
    public UserEntity getUserByName(String name)
    {
        //name으로 UserEntity 가져오기
        Optional<UserEntity> userEntity = userRepository.findByName(name);
        //UserEntity가 존재하지 않으면 예외 처리
        if (userEntity.isEmpty())
        {
            throw new NoDataException("User name not found");
        }

        //UserEntity 반환
        return userEntity.get();
    }

}
