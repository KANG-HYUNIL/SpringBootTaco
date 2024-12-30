package com.Kang.SpringBoot_Jpa.entity;


//사용자 계정 데이터 관리할 Entity Class

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "user_table")
public class UserEntity {

    @Id
    private String id; //User의 Id

    @Column
    private String password; //User의 Password

    @Column
    private String name; //User의 이름

    @Column(unique = true)
    private String email; //User의 이메일

    @Column
    private String role; //User의 권한 (ROLE_USER, ROLE_ADMIN)

//    @OneToMany //1대다 관계 설정 annotation
//    @JoinColumn(name="user_id") //BoardEntity의 user_id 컬럼과 매핑
//    private List<BoardEntity> writtenBoardList; //작성한 게시글 목록
}
