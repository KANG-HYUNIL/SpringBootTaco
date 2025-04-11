package com.Kang.SpringBoot_Jpa.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

//Jwt Token의 생성, 검증, 추출을 담당하는 클래스
@Component
public class JwtUtil {

    //JWT 서명에 사용할 비밀키
    private SecretKey secretKey;
    //JWT 만료 시간
    @Getter
    private final long expiredMsAccess;

    @Getter
    private final long expiredMsRefresh;

    //생성자 의존성 주입
    public JwtUtil(@Value("${jwt.access.secret}") String secret,
                   @Value("${jwt.access.expiration}") long expiredMsAccess,
                   @Value("${jwt.refresh.expiration}") long expiredMsRefresh) {

        //비밀키 생성
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        this.expiredMsAccess = expiredMsAccess;
        this.expiredMsRefresh = expiredMsRefresh;

    }

    //토큰에서 username 추출
    public String getUsername(String token) {

        //토큰에서 username을 추출해서 반환
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
    }

    //토큰에서 role 추출
    public String getRole(String token) {

        //토큰에서 role을 추출해서 반환
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    //토큰 만료 여부 확인
    public Boolean isExpired(String token) {
        //
        try{
            return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
        }
        catch(ExpiredJwtException e)
        {
            return true;
        }

    }

    //Access Token 생성
    public String createAccessJwt(String username, String role) {
        return Jwts.builder()
                .claim("category", "access")
                .claim("username", username)
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMsAccess))
                .signWith(secretKey)
                .compact();
    }

    //Refresh Token 생성
    public String createRefreshJwt(String username, String role) {
        return Jwts.builder()
                .claim("category", "refresh")
                .claim("username", username)
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMsRefresh))
                .signWith(secretKey)
                .compact();
    }

    //Jwt의 Category 항목 추출 메서드, "access" 와 "refresh" 두 가지 값 중 하나를 반환
    public String getCategory(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

}
