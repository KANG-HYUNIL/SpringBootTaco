package com.Kang.SpringBoot_Jpa.service;

import com.Kang.SpringBoot_Jpa.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@Slf4j
public class ReissueService {

    //JWTUtil 의존성
    private final JwtUtil jwtUtil;
    private final RedisService<String> redisService;
    private final String refreshString = "refresh_";

    public ReissueService(JwtUtil jwtUtil, RedisService<String> redisService) {
        this.jwtUtil = jwtUtil;
        this.redisService = redisService;
    }

    public ResponseEntity<?> reissueRefreshToken(HttpServletRequest request, HttpServletResponse response) {
        try {
            //Refresh Token을 가져옴
            String refresh = null;
            Cookie[] cookies = request.getCookies();
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refresh = cookie.getValue();
                }
            }

            //Refresh Token이 없을 경우
            if (refresh == null)
            {
                return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
            }

            //Refresh Token 유효성 검사
            if (jwtUtil.isExpired(refresh))
            {
                return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
            }

            //Refresh Token의 Category가 refresh가 아닐 경우
            String category = jwtUtil.getCategory(refresh);
            if (!category.equals("refresh")) {
                return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
            }

            //Refresh Token의 Username과 Redis에 저장된 Refresh Token이 일치하지 않을 경우
            String username = jwtUtil.getUsername(refresh);
            String storedRefresh = redisService.getValues(refreshString + username);
            if (storedRefresh == null || !storedRefresh.equals(refresh))
            {
                return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
            }

            //Role 가져오기
            String role = jwtUtil.getRole(refresh);

            //token 재발행
            String newAccess = jwtUtil.createAccessJwt(username, role);
            String newRefresh = jwtUtil.createRefreshJwt(username, role);

            //redis 저장소에 저장된 Refresh Token 삭제 후 새로운 Refresh Token 저장
            redisService.deleteValues(refreshString + username);
            addRefreshEntity(username, newRefresh);

            //응답 헤더와 쿠키에 새로운 Access Token과 Refresh Token 저장
            response.setHeader("access", newAccess);
            response.addCookie(createCookie("refresh", newRefresh));

            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e)
        {
            log.error("Error reissuing refresh token: {}", e.getMessage(), e);
            return new ResponseEntity<>("Error reissuing refresh token", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Cookie 생성 메소드
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }

    //Refresh Token을 DB에 저장하는 메소드
    private void addRefreshEntity(String username, String refresh) {
        Duration expiration = Duration.ofMillis(jwtUtil.getExpiredMsRefresh());
        redisService.setValues("refresh_" + username, refresh, expiration);
    }


}
