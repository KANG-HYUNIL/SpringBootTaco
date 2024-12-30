package com.Kang.SpringBoot_Jpa.service;

import com.Kang.SpringBoot_Jpa.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
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
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh")) {
                refresh = cookie.getValue();
            }
        }

        if (refresh == null) {
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        if (!jwtUtil.isExpired(refresh)) {
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        String category = jwtUtil.getCategory(refresh);
        if (!category.equals("refresh")) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        //fixme Redis 활용으로 변경 필요
        String username = jwtUtil.getUsername(refresh); //사용자 id 가져오기
        String storedRefresh = redisService.getValues(refreshString + username);
        if (storedRefresh == null || !storedRefresh.equals(refresh)) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        //refresh token에서 role 가져오기
        String role = jwtUtil.getRole(refresh);

        //Access, Refresh Token 생성
        String newAccess = jwtUtil.createAccessJwt(username, role);
        String newRefresh = jwtUtil.createRefreshJwt(username, role);

        //fixme Redis 활용으로 변경 필요
        redisService.deleteValues("refresh_" + username);
        addRefreshEntity(username, newRefresh);

        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        return new ResponseEntity<>(HttpStatus.OK);
    }

    //Cookie 생성 메소드
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        //cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }

    //Refresh Token을 DB에 저장하는 메소드
    private void addRefreshEntity(String username, String refresh) {
        Duration expiration = Duration.ofMillis(jwtUtil.getExpiredMsRefresh());
        redisService.setValues("refresh_" + username, refresh, expiration);
    }


}
