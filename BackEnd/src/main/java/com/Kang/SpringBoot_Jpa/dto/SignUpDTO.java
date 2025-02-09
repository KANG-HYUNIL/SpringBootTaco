package com.Kang.SpringBoot_Jpa.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SignUpDTO {

    private String id; //User의 Id
    private String password; //User의 Password
    private String name; //User의 이름
    private String email; //User의 email
    private String role; //User의 권한 (ROLE_USER, ROLE_ADMIN)
    private String authCode; //인증 코드

}
