package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.dto.EmailRequestDTO;
import com.Kang.SpringBoot_Jpa.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Console;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;


    //회원가입 시 이메일 인증 요청에 대한 처리, 이미 존재하는 이메일 사용 불가
    @PostMapping("/email/signup_verification_req")
    public ResponseEntity<?> sendSignUpVerificationEmail(@RequestBody EmailRequestDTO emailRequest)
    {
        //이메일 주소
        String email = emailRequest.getEmail();

        //신규 이메일 주소로 인증 메일 시도
        memberService.sendSignUpCodeToEmail(email);
        //인증번호 전송 성공
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //아이디 및 비밀번호 찾기 시 이메일 인증 요청에 대한 처리, 이미 존재하는 이메일이여야만 함
    @PostMapping("/email/find_verification_req")
    public ResponseEntity<?> sendFindVerificationEmail(@RequestBody EmailRequestDTO emailRequest)
    {
        //이메일 주소
        String email = emailRequest.getEmail();
        //이미 존재하는 이메일 주소로 인증 메일 시도
        memberService.sendFindCodeToEmail(email);
        //인증번호 전송 성공
        return new ResponseEntity<>(HttpStatus.OK);
    }


    //이메일 인증 번호 확인에 대한 처리
    @GetMapping("/emails/verifications")
    public ResponseEntity<?> verificationEmail(@RequestBody EmailRequestDTO emailRequest) {

        //이메일 주소와 인증번호
        String email = emailRequest.getEmail();
        String authCode = emailRequest.getAuthCode();

        //이메일 주소와 인증번호 확인
        memberService.verifyAuthCode(email, authCode);

        //OK(200) 반환
        return new ResponseEntity<>("Verification Success", HttpStatus.OK);

    }

}
