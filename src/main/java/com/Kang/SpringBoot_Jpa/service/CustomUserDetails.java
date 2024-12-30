package com.Kang.SpringBoot_Jpa.service;

import com.Kang.SpringBoot_Jpa.entity.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

//UserDetails는 Spring Security에서 사용자 정보를 담는 인터페이스
//이름, 비밀번호, 권한 등을 제공하는 메서드를 정의
//이 인터페이스를 구현한 클래스를 만들어서 사용자 정보를 담아서 반환
//우리는 사용자 데이터를 UserEntity로 관리하므로, 그 양식에 맞게 함수 Override 변환
public class CustomUserDetails implements UserDetails {

    //DB에서 가져온 UserEntity
    private final UserEntity userEntity;

    //생성자로 의존성 주입
    public CustomUserDetails(UserEntity userEntity) {

        this.userEntity = userEntity;
    }

    //User의 권한을 반환하는 메서드
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        //객체를 담는 Collection 생성
        Collection<GrantedAuthority> collection = new ArrayList<>();

        //Collection에 getAuthority를 Override한 GrantedAuthority 객체를 추가
        collection.add(new GrantedAuthority() {

            //권한
            @Override
            public String getAuthority() {

                return userEntity.getRole();
            }
        });

        return collection;
    }

    //비밀번호
    @Override
    public String getPassword() {

        return userEntity.getPassword();
    }

    //유저 아이디
    @Override
    public String getUsername() {

        return userEntity.getId();
    }

    //계정 만료 여부
    @Override
    public boolean isAccountNonExpired() {

        return true;
    }

    //계정 잠김 여부
    @Override
    public boolean isAccountNonLocked() {

        return true;
    }

    //비밀번호 만료 여부
    @Override
    public boolean isCredentialsNonExpired() {

        return true;
    }

    //계정 활성화 여부
    @Override
    public boolean isEnabled() {

        return true;
    }
}
