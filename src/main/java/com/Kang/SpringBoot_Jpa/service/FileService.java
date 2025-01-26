package com.Kang.SpringBoot_Jpa.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import com.Kang.SpringBoot_Jpa.dto.DisplayedFileDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

//모든 파일(이미지, 동영상) 업로드 관리 Service
@Service
@Slf4j
public class FileService {

    //저장소의 경로는 이후에 서버를 클라우드에 적재 시 변경해야 함. S3로 대체 예정.

    // 미리 저장소 경로
    private final String PRESTORAGE = "C:/Users/KANG/Desktop/Self-study/Spring_Boot/Test/temp/";

    // 실제 저장소 경로
    private final String REALSTORAGE = "C:/Users/KANG/Desktop/Self-study/Spring_Boot/Test/real/";

    //미리 저장소에 파일 저장하고 저장된 파일 경로 반환
    public DisplayedFileDTO filePreUpload(MultipartFile multipartFile) {

        String fileName = null;

        try {
            fileName = multipartFile.getOriginalFilename();

            // UUID
            String uniqueId = UUID.randomUUID().toString();
            String uniqueFileName = uniqueId + "_" + fileName; // UUID와 원본 파일 이름 결합

            //파일 미리 저장 경로 설정
            String filePath = PRESTORAGE + uniqueFileName;


            File directory = new File(PRESTORAGE);
            if (!directory.exists()) {
                directory.mkdirs(); // 폴더가 존재하지 않으면 생성
            }

            multipartFile.transferTo(new File(filePath)); //파일 저장

            DisplayedFileDTO displayedFileDTO = new DisplayedFileDTO(); //DTO 객체 생성
            displayedFileDTO.setFileName(uniqueFileName); //파일 이름 설정
            displayedFileDTO.setFilePath(filePath); //파일 경로 설정

            log.info("File pre-upload successful: FileName={}, FilePath={}", fileName, filePath);
            return displayedFileDTO; //저장된 파일 경로 반환

        } catch (Exception e) {
            log.error("File pre-upload failed: FileName={}, Error={}", fileName, e.getMessage(), e);
            throw new IllegalArgumentException("파일 업로드 실패 " + e);
        }

    }

    //이미지가 저장되어 있는 예비 파일 경로를 받으면, 그 경로에 있는 파일을 실제 저장소의 위치로 옮기고, 그 파일의 실제 저장소 경로를 반환
    //실제 저장소 경로를 반환받은 후에 그 경로를 게시물 본문에 끼어 있는 img나 video 태그의 src 속성에 넣어 갱신시켜줘야 함
    public DisplayedFileDTO fileRealUpload(String filePrePath)
    {
        try {
            //실제 저장소 경로 생성
            File directory = new File(REALSTORAGE);
            if (!directory.exists())
            {
                directory.mkdirs(); // 폴더가 존재하지 않으면 생성
            }


            // 파일 이름을 토대로 예비 저장소에서 파일 탐색 시도
            File preFile = new File(filePrePath);
            if (!preFile.exists()) {
                return null; // 파일이 존재하지 않으면 null 반환
            }

            // 실제 저장소 경로 설정
            String realFilePath = REALSTORAGE + preFile.getName();
            File realFile = new File(realFilePath); // 실제 저장소에 저장할 파일 객체 생성


            // 파일을 실제 저장소로 이동
            if (preFile.renameTo(realFile))
            {
                // DisplayedFileDTO 객체 생성 및 반환
                DisplayedFileDTO displayedFileDTO = new DisplayedFileDTO();
                displayedFileDTO.setFileName(preFile.getName());
                displayedFileDTO.setFilePath(realFilePath);

                log.info("File real-upload successful: FileName={}, FilePath={}", preFile.getName(), realFilePath);
                return displayedFileDTO;
            }
            else
            {
                throw new IOException("파일 이동 실패");
            }
        } catch (IOException e)
        {
            log.error("File real-upload failed: FilePrePath={}, FileName={}, Error={}", filePrePath, new File(filePrePath).getName(), e.getMessage(), e);
            throw new IllegalArgumentException("파일 업로드 실패 " + e);
        }
    }

    //저장소에서 해당 파일을 가져와 돌려주는 메서드
    //File, cURL 등을 처리하는 Resource 클래스 채용
    public Resource getFile(String filePath) {
        try {
            // 서로 다른 OS 에서도 작동 가능하게 Path, Paths, UrlResource 사용
            Path path = Paths.get(filePath);
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
            else
            {
                throw new IOException("Could not read file: " + filePath);
            }
        }
        catch (IOException e)
        {
            log.error("File retrieval failed: FilePath={}, Error={}", filePath, e.getMessage(), e);
            throw new IllegalArgumentException("File not found " + e);
        }
    }



}
