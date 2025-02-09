package com.Kang.SpringBoot_Jpa.jwt;

import com.Kang.SpringBoot_Jpa.dto.LoginDTO;
import com.Kang.SpringBoot_Jpa.exception.InvalidInputException;
import com.Kang.SpringBoot_Jpa.service.CustomUserDetails;
import com.Kang.SpringBoot_Jpa.service.RedisService;
import com.Kang.SpringBoot_Jpa.utils.InputValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;



import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Collection;
import java.util.Iterator;

//UsernamePasswordAuthenticationFilter는 스프링 시큐리티의 필터
//폼 기반 로그인 요청을 처리하는 클래스, 이름과 비밀번호 추출 추 이를 통한 인증 시도함
//여기서는 상속받고 Override를 통해 커스텀 필터 생성
//또한 로그인 성공 시 JwtUtil의 메서드 이용해 Jwt Token 발급
//SecurityConfig의 설정에 따라, /login 으로 POST 시 자동으로 등록된 이 Filter가 요청을 가로챔
@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {



    //AuthenticationManager는 스프링 시큐리티에서 인증을 처리하는 인터페이스
    private final AuthenticationManager authenticationManager;
    //JWTUtil 주입
    private final JwtUtil jwtUtil;

    //RedisService 주입
    private final RedisService<String> redisService;

    //Refresh Token key에 붙여질 String
    private final String refreshString = "refresh_";

    //생성자로 의존성 주입
    //AuthenticationManager는 SecurityConfig의
    //authenticationManager(AuthenticationConfiguration configuration) 로 획득
    public LoginFilter(AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil,
                       RedisService<String> redisService) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.redisService = redisService;
    }

    //요청에서 username 과 password 추출, 인증 시도
    //요청을 가로챘을 때에 자동으로 실행됨
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {


        // form 형식으로 데이터 전달 시 처리방법
//        String username = request.getParameter("id"); // 폼 데이터에서 id 추출
//        String password = obtainPassword(request); // 폼 데이터에서 password 추출


        //json body로 데이터를 전달할 때에 처리법
        LoginDTO loginDTO = new LoginDTO();

        //fixme
        try{
            //요청의 InputStream을 통해 json body를 읽어옴
            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            if (inputStream.available() > 0) {
                String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
                loginDTO = objectMapper.readValue(messageBody, LoginDTO.class);
            }
            else
            {
                throw new RuntimeException("No content to map due to end-of-input");
            }
        }
        catch (IOException e)
        {
            throw new RuntimeException(e);
        }

        //클라이언트 요청에서 username, password 추출
        String username = loginDTO.getId(); //요청에 username 멤버가 없어서, 강제로 추출 후 사용
        String password = loginDTO.getPassword(); //request.getParameter("password");



        if (!InputValidator.isValid(username) || !InputValidator.isPasswordValid(password)) {
            throw new InvalidInputException("Invalid username or password") {};
        }

        //스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);



        //token에 담은 검증을 위한 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
    }

    //로그인 성공시 실행하는 메소드 (여기서 JWT를 발급하면 됨)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {

        //사용자 정보가 담긴 CustomUserDetails 생성
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        //CustomUserDetails에서 username(id) 추출
        String username = customUserDetails.getUsername();
        String ipAddress = request.getRemoteAddr();

        //GrantedAuthority 객체를 Collection으로 변환
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        //Collection을 반복 접근하기 위한 Iterator 가져오기
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        //Collection의 첫 번째 객체 가져오기
        GrantedAuthority auth = iterator.next();

        //권한 추출
        String role = auth.getAuthority();

        //JWT Access, Refresh Token 생성
        String accessJwt = jwtUtil.createAccessJwt(username, role);
        String refreshJwt = jwtUtil.createRefreshJwt(username, role);

        //Refresh 토큰 저장
        addRefreshEntity(username, refreshJwt);

        //응답의 헤더 및 쿠키에 Jwt 설정
        response.setHeader("access", accessJwt); //응답 헤더에 access 키로 accessJwt 값 설정
        response.addCookie(createCookie("refresh", refreshJwt)); //응답 쿠키에 refresh 키로 refreshJwt 값 설정
        response.setStatus(HttpStatus.OK.value()); //응답 코드 200 반환

        response.setContentType("application/json");
        response.getWriter().write("{\"message\": \"Login successful\"}");

        log.info("Successful login by user: {} from IP: {}", username, ipAddress);

    }

    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        //로그인 실패시 401 응답 코드 반환
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        response.getWriter().write("{\"message\": \"Unauthorized\"}");

        String ipAddress = request.getRemoteAddr();
        // Log the failed login attempt
        log.info("Failed login attempt from IP: {}", ipAddress);

    }

    //Cookie 생성 메소드
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value); //쿠키 생성
        cookie.setMaxAge(24*60*60); //쿠키 만료 시간 설정
        cookie.setSecure(true); //https에서만 쿠키 전송
        cookie.setPath("/"); //쿠키 경로 설정
        cookie.setHttpOnly(true); //자바스크립트에서 쿠키 접근 불가

        return cookie;
    }

    //Refresh Token을 DB에 저장하는 메소드
    private void addRefreshEntity(String username, String refresh) {

        //현재 시간에 만료 시간을 더한 시간을 Date 객체로 생성
        Duration expiration = Duration.ofMillis(jwtUtil.getExpiredMsRefresh());
        redisService.setValues(refreshString + username, refresh, expiration);
    }

}