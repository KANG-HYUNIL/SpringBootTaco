package com.Kang.SpringBoot_Jpa.jwt;

import com.Kang.SpringBoot_Jpa.entity.UserEntity;
import com.Kang.SpringBoot_Jpa.service.CustomUserDetails;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {

        this.jwtUtil = jwtUtil;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 헤더에서 access키에 담긴 토큰을 꺼냄
        String accessToken = request.getHeader("access");

        // 토큰이 없다면 다음 필터로 넘김
        if (accessToken == null) {

            // 다음 필터로 넘김
            filterChain.doFilter(request, response);

            return;
        }

        // 토큰이 만료되었다면 다음 필터로 넘기지 않음
        if (!jwtUtil.isExpired(accessToken))
        {
            //response body
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 토큰이 category 항목 가져와 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(accessToken);

        //category 항목이 access가 아니라면 다음 필터로 넘기지 않음
        if (!category.equals("access")) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        //Access Token에서 username, role 값을 획득
        String username = jwtUtil.getUsername(accessToken);
        String role = jwtUtil.getRole(accessToken);

        //UserEntity 객체 생성 및 id와 role 값 부여
        UserEntity userEntity = new UserEntity();
        userEntity.setId(username);
        userEntity.setRole(role);
        //UserEntity 객체를 CustomUserDetails 객체로 변환
        CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);

        //CustomUserDetails 객체를 Authentication 객체로 변환
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken); //SecurityContextHolder에 Authentication 객체 저장

        //다음 필터로 넘김
        filterChain.doFilter(request, response);
    }
}
