package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.jwt.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

//Spring boot의 Security filter를 거치지 않는 jwt token 을 처리하는 controller
@RestController
public class TokenValidationController {

    //의존성 주입
    private final JwtUtil jwtUtil;

    public TokenValidationController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    //jwt token 유효성 검사, USER 및 ADMIN 모두에게 허용
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("access") String accessToken) {

        //토큰이 없거나 만료되었다면 NOT_ACCEPTABLE 406 반환
        if (accessToken == null || !jwtUtil.isExpired(accessToken)) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }

        //토큰의 role이 USER나 ADMIN이 아니라면 FORBIDDEN 반환
        String role = jwtUtil.getRole(accessToken);
        if (!role.equals("ROLE_USER") && !role.equals("ROLE_ADMIN")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    //jwt token 유효성 검사, ADMIN에게만 허용
    @PostMapping("/validate-admin-token")
    public ResponseEntity<?> validateAdminToken(@RequestHeader("access") String accessToken) {

        //토큰이 없거나 만료되었다면 NOT_ACCEPTABLE 406 반환
        if (accessToken == null || jwtUtil.isExpired(accessToken)) {
            return new ResponseEntity<>("access token error", HttpStatus.NOT_ACCEPTABLE);
        }

        //토큰의 role이 ADMIN이 아니라면 FORBIDDEN 반환
        String role = jwtUtil.getRole(accessToken);
        if (!role.equals("ROLE_ADMIN")) {
            return new ResponseEntity<>("token role error", HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
