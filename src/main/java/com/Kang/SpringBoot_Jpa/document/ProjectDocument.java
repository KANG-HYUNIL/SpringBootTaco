package com.Kang.SpringBoot_Jpa.document;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "projectData")
@Data
public class ProjectDocument {

    @Id
    private String id; //PK

    private String thumbnail; //썸네일

    private String term; // 기수 (3기, 4기)

    private String team; // 팀 이름

    private String title; //제목

    private String content; //본문 내용

}
