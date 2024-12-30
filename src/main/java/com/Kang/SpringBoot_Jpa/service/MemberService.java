package com.Kang.SpringBoot_Jpa.service;

import com.Kang.SpringBoot_Jpa.exception.DuplicateDataException;
import com.Kang.SpringBoot_Jpa.exception.InvalidAuthCodeException;
import com.Kang.SpringBoot_Jpa.exception.NoDataException;
import com.Kang.SpringBoot_Jpa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    //의존성 주입
    private static final String AUTH_CODE_PREFIX = "AuthCode ";
    private final EmailService mailService;
    private final RedisService<String> redisService; //RedisService 객체 생성 및 관리(제네릭 타입은 String)
    private final UserRepository userRepository;

    @Value("${spring.mail.auth-code-expiration}")
    private long authCodeExpirationMillis;

    //회원가입 시 이메일 인증 요청에 대한 처리, 이미 존재하는 이메일 사용 불가
    public void sendSignUpCodeToEmail(String toEmail)
    {
        try {
            //이메일이 이미 존재하는지 확인, 이미 존재한다면
            if(checkDuplicatedEmail(toEmail))
            {
                //인증번호 안보내고 이미 존재한다는 응답 보내야 함
                throw new DuplicateDataException("Email already exists");
            }

            String title = "TACO 회원가입 인증번호"; //이메일 제목
            String authCode = this.createCode(); //인증번호 생성

            mailService.sendEmail(toEmail, title, authCode); //이메일 전송

            //redis에 저장하기
            Duration authCodeExpiration = Duration.ofMillis(authCodeExpirationMillis);
            redisService.setValues(AUTH_CODE_PREFIX + toEmail, authCode, authCodeExpiration);

        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //아이디 및 비밀번호 찾기 시 이메일 인증 요청에 대한 처리, 이미 존재하는 이메일이여야만 함
    public void sendFindCodeToEmail(String toEmail)
    {
        try {
            if(!checkDuplicatedEmail(toEmail))
            {
                //인증번호 안보내고 존재하지 않는다는 응답 보내야 함
                throw new NoDataException("Email does not exist");
            }

            String title = "TACO 회원가입 인증번호"; //이메일 제목
            String authCode = this.createCode(); //인증번호 생성

            mailService.sendEmail(toEmail, title, authCode); //이메일 전송

            //redis에 저장하기
            Duration authCodeExpiration = Duration.ofMillis(authCodeExpirationMillis);
            redisService.setValues(AUTH_CODE_PREFIX + toEmail, authCode, authCodeExpiration);

        } catch(Exception e) {
            throw new RuntimeException(e);
        }
    }

    //해당 이메일 주소가 이미 존재하는지 여부를 검증하는 메서드
    private boolean checkDuplicatedEmail(String email)
    {
        return userRepository.existsByEmail(email);
    }


    //인증번호 생성 메서드
    private String createCode() {
        int lenth = 6; //인증번호 길이
        try {
            //SecureRandom 객체 생성
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < lenth; i++) {
                builder.append(random.nextInt(10));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {

            //fixme: ExceptionCode.NO_SUCH_ALGORITHM
            throw new RuntimeException(e);
        }
    }

    //이메일 인증 번호 확인에 대한 처리
    public void verifyAuthCode(String email, String authCode) {
        String storedAuthCode = redisService.getValues(AUTH_CODE_PREFIX + email);

        //인증번호 불일치 시
        if (!authCode.equals(storedAuthCode)) {
            throw new InvalidAuthCodeException("Invalid authentication code");
        }
    }
}
