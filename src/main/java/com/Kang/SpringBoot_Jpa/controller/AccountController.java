package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.dto.EmailRequestDTO;
import com.Kang.SpringBoot_Jpa.dto.SignUpDTO;
import com.Kang.SpringBoot_Jpa.dto.UserDTO;
import com.Kang.SpringBoot_Jpa.exception.AccountLoginException;
import com.Kang.SpringBoot_Jpa.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController //Controller + ResponseBody
@RequiredArgsConstructor
@RequestMapping("/account")
public class AccountController {

    //계정 관련 컨트롤러
    private final AccountService accountService;

    //login View Get 메서드
    @GetMapping("/login")
    public String login() {
        return "/account/login";
    }

    //signup View Get 메서드
    @GetMapping("/signup")
    public String signup() {
        return "/account/signup";
    }

    //회원가입 요청 POST 처리 메서드
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpDTO signUpDTO) {
        accountService.signUp(signUpDTO);
        return new ResponseEntity<>("Sign up success", HttpStatus.OK);
    }

}
