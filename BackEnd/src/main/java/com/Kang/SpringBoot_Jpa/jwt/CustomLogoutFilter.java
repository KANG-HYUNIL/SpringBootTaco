package com.Kang.SpringBoot_Jpa.jwt;

import com.Kang.SpringBoot_Jpa.service.RedisService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@Slf4j
public class CustomLogoutFilter extends GenericFilterBean {

    private final JwtUtil jwtUtil;
    private final RedisService<String> redisService;
    private final String refreshString = "refresh_";

    public CustomLogoutFilter(JwtUtil jwtUtil,
                              RedisService<String> redisService)
    {
        this.jwtUtil = jwtUtil;
        this.redisService = redisService;
    }


    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        //path and method verify
        //URI 경로 가져오기?
        String requestUri = request.getRequestURI();
        //log.info("Request URI: {}", requestUri);

        //logout으로 끝나는 경로가 아닐 경우에
        if (!requestUri.endsWith("/logout"))
        {
            //log.info("Not Logout Path");
            //다음 Filter로 넘기기
            filterChain.doFilter(request, response);
            return;
        }

        String requestMethod = request.getMethod();

        //POST 요청이 아니라면
        if (!requestMethod.equals("POST")) {

            //log.info("Not POST Method");
            //다음 Filter로 넘기기
            filterChain.doFilter(request, response);
            return;
        }

        //get refresh token
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            //Refresh Token 가져오기
            if (cookie.getName().equals("refresh")) {

                refresh = cookie.getValue();
            }
        }

        //refresh null check
        if (refresh == null) {

            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        //이미 만료된 토큰이라면
        if (jwtUtil.isExpired(refresh))
        {
            //response status code
            //다음 Filter로 넘기지 않고 응답
            //Refresh 토큰 Cookie 값 0
            Cookie cookie = new Cookie("refresh", null);
            cookie.setMaxAge(0);
            cookie.setPath("/");

            response.addCookie(cookie);
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }


        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        //Refresh Token이 아니라면
        if (!category.equals("refresh")) {

            //response status code
            //다음 Filter로 넘기지 않고 응답
            //Refresh 토큰 Cookie 값 0
            Cookie cookie = new Cookie("refresh", null);
            cookie.setMaxAge(0);
            cookie.setPath("/");

            response.addCookie(cookie);
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        //Redis에 Refresh Token이 존재하는지 확인
        String username = jwtUtil.getUsername(refresh);
        boolean isExist = redisService.checkExistsValue(refreshString + username);
        if (!isExist) {
            //Refresh 토큰 Cookie 값 0
            Cookie cookie = new Cookie("refresh", null);
            cookie.setMaxAge(0);
            cookie.setPath("/");

            response.addCookie(cookie);
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        //로그아웃 진행, refresh token이 존재하며, 유효하고, redis에도 존재한다면 로그아웃 진행
        //
        //Refresh 토큰 DB에서 제거
        redisService.deleteValues(refreshString + username);

        //Refresh 토큰 Cookie 값 0
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");

        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }

}
