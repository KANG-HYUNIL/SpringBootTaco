package com.Kang.SpringBoot_Jpa.config;


import com.Kang.SpringBoot_Jpa.jwt.CustomLogoutFilter;
import com.Kang.SpringBoot_Jpa.jwt.JwtFilter;
import com.Kang.SpringBoot_Jpa.jwt.JwtUtil;
import com.Kang.SpringBoot_Jpa.jwt.LoginFilter;
import com.Kang.SpringBoot_Jpa.service.RedisService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.ArrayList;
import java.util.Arrays;

@Configuration //설정, config 클래스 정의. Bean 메서드를 포함하며, Bean 등록
@EnableWebSecurity // 스프링 시큐리티 설정 활성화. WebSecurityConfigurerAdapter 상속받은 클래스를 설정하여 사용
public class SecurityConfig {

    //Bean은 스프링 컨테이너가 관리하는 객체, 메서드에 적용하면 해당 메서드의 반환값(객체)이 스프링에 의해 관리
    //외부에서 Autowired 어노테이션을 통해 주입받아 사용 가능
    //서로 다른 메서드에서 모두 Bean을 사용하여 동일한 클래스를 반환한다면,
    //Qualifier 어노테이션을 통해 구분하여 사용해야 함

    private final String loginURL = "/account/login"; //로그인 URL

    //AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
    //스프링 시큐리티에서 인증을 설정하는 클래스
    //AuthenticationManager를 생성하는데 필요한 정보를 제공
    private final AuthenticationConfiguration authenticationConfiguration;

    //Jwt Token 생성을 위한 JwtUtil 객체 생성자 주입
    private final JwtUtil jwtUtil;

    //RefreshRepository 생성자 주입
    private final RedisService<String> redisService;

    //생성자 정의
    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration,
                          JwtUtil jwtUtil,
                          RedisService<String> redisService) {

        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
        this.redisService = redisService;
    }

    //AuthenticationManager Bean 등록
    //스프링 시큐리티 인증 처리 인터페이스
    //Authentication 요청 처리, 자격 증명, 권한을 포함하는 인증 객체를 반환하는 기능 제공
    //AuthenticationProvider 인스턴스에 interface 구현을 통해 인증 과정 위임 가
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

//    //특정 경로에 대해 스프링 시큐리티를 아예 거치지 않게 설정
//    @Bean
//    public WebSecurityCustomizer webSecurityCustomizer(){
//        return web -> web.ignoring().requestMatchers("/dush", "/dush2");
//    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        //허용 경로 설정
        ArrayList<String> publicPaths =
                new ArrayList<>(Arrays.asList(
                        "/login", //로그인
                        "/", //홈
                        "/join",
                        "/reissue", //Refresh Token 재발급
                        "/member/email/signup_verification_req", //회원가입 이메일 인증 요청
                        "/account/signup", //회원가입
                        "/member/email/find_verification_req", //계정 찾기 이메일 인증 요청
                        "/member/emails/verifications", //이메일 인증 번호 대조 요청
                        "/account/login" //로그인
                        ));

        //csrf disable
        http
                .csrf((auth) -> auth.disable());

        //From 로그인 방식 disable
        http
                .formLogin((auth) -> auth.disable());

        //http basic 인증 방식 disable
        http
                .httpBasic((auth) -> auth.disable());

        //경로별 인가 작업, 허용 경로 변경 및 경로 추가 시 항상 수정 필요 fixme
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers(publicPaths.toArray(new String[0])).permitAll() //특정 경로에서 모두 허용, 경로 변경 필요
                        .requestMatchers("/admin/**").hasRole("ADMIN") //특정 경로에서 ADMIN만 허용
                        .anyRequest().authenticated());

        //세션 설정
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        //필터 추가 LoginFilter()는 인자를 받음 (AuthenticationManager() 메소드에 authenticationConfiguration 객체를 넣어야 함) 따라서 등록 필요
        //커스텀한 LoginFilter 를 UsernamePasswordAuthenticationFilter.class 위치에 추가
        //fixme
        LoginFilter loginFilter = new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil, redisService);
        JwtFilter jwtFiler = new JwtFilter(jwtUtil);

        loginFilter.setFilterProcessesUrl(loginURL); //특정 경로의 로그인 요청에 대해서만 처리하도록 수정 가능
        http.addFilterBefore(jwtFiler, LoginFilter.class);
        http.addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(new CustomLogoutFilter(jwtUtil, redisService), LoginFilter.class);

        return http.build();
    }

    //비밀번호 암호화 클래스 채용 BCryptPasswordEncoder
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {

        return new BCryptPasswordEncoder();
    }



}
