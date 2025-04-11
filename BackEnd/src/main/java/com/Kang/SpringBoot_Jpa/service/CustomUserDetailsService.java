package com.Kang.SpringBoot_Jpa.service;

import com.Kang.SpringBoot_Jpa.entity.UserEntity;
import com.Kang.SpringBoot_Jpa.exception.AccountLoginException;
import com.Kang.SpringBoot_Jpa.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

//UserDetailsService는 Spring Security에서 사용자 인증 처리를 위해 사용하는 인터페이스
//loadUserByUsername 메서드를 구현해서 사용자 이름으로 UserDetails 객체를 생성해 반환
//Spring Security가 사용하는 AuthenticationProvider는 프로젝트에서
//UserDetailsService를 구현하는 클래스를 자동으로 감지해 loadUserByUsername 메서드를 호출
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        //DB에서 조회
        UserEntity userData = userRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("ID does not exist."));

        if (userData != null) {

            //UserDetails에 담아서 return하면 AutneticationManager가 검증 함
            return new CustomUserDetails(userData);
        }

        return null;
    }
}
