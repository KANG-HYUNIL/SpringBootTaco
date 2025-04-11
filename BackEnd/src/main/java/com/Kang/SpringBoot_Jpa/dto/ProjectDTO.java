package com.Kang.SpringBoot_Jpa.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProjectDTO {

    //Project 게시물 정보를 중간에서 관리할 DTO 클래스

    //thumbnail, term, team, title 가 외관 페이지에 나타날 것이고, content는 세부 페이지에 진입 시 사용

    private String id;

    private String thumbnail; //썸네일에 들어갈 이미지가 저장된 경로를 보관할 멤버

    private String term; //3기, 4기 할 때의 기수를 보관할 멤버. 귀찮으니 String으로

    private String team; //팀의 이름

    private String title; //프로젝트의 제목

    private String content; //프로젝트의 내용

    private List<String> attachmentFilePaths; //첨부 파일 경로들

}
