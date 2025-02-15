package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.Converter.UserConverter;
import com.Kang.SpringBoot_Jpa.dto.EmailRequestDTO;
import com.Kang.SpringBoot_Jpa.dto.SignUpDTO;
import com.Kang.SpringBoot_Jpa.dto.UserDTO;
import com.Kang.SpringBoot_Jpa.entity.UserEntity;
import com.Kang.SpringBoot_Jpa.exception.AccountLoginException;
import com.Kang.SpringBoot_Jpa.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@RequestMapping("/account")
@Slf4j
public class AccountController {

    //계정 관련 컨트롤러
    private final AccountService accountService;

//    @GetMapping("/login")
//    public String login(HttpServletRequest request) {
//        String ipAddress = request.getRemoteAddr();
//        log.info("Login page accessed by IP: {}", ipAddress);
//        return "/account/login";
//    }
//
//    @GetMapping("/signup")
//    public String signup(HttpServletRequest request) {
//        String ipAddress = request.getRemoteAddr();
//        log.info("Signup page accessed by IP: {}", ipAddress);
//        return "/account/signup";
//    }

    //회원가입 요청 POST 처리 메서드
    @PostMapping("/signup")
    @ResponseBody
    public ResponseEntity<?> signup(@RequestBody SignUpDTO signUpDTO) {
        accountService.signUp(signUpDTO);
        return new ResponseEntity<>("Sign up success", HttpStatus.OK);
    }

    // id로 사용자 정보 획득 메서드
    @PostMapping("/getUserById")
    @ResponseBody
    public ResponseEntity<List<UserDTO>> getUserById(@RequestBody UserDTO userDTO) {
        List<UserEntity> userEntities = accountService.getUserById(userDTO.getId());
        List<UserDTO> responseUserDTOs = userEntities.stream()
                .map(UserConverter::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responseUserDTOs, HttpStatus.OK);
    }

    // name으로 사용자 정보 획득 메서드
    @PostMapping("/getUserByName")
    @ResponseBody
    public ResponseEntity<List<UserDTO>> getUserByName(@RequestBody UserDTO userDTO) {
        List<UserEntity> userEntities = accountService.getUserByName(userDTO.getName());
        List<UserDTO> responseUserDTOs = userEntities.stream()
                .map(UserConverter::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responseUserDTOs, HttpStatus.OK);
    }

}
