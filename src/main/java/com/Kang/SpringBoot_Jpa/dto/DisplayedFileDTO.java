package com.Kang.SpringBoot_Jpa.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//미리 업로드 파일 데이터 관리를 위한 DTO
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DisplayedFileDTO {

    //파일 이름
    private String fileName;

    //저장 위치
    private String filePath;
}
