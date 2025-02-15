package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.dto.DisplayedFileDTO;
import com.Kang.SpringBoot_Jpa.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;


//
@Slf4j
@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    //게시물 작성 중 첨가한 파일을 미리 예비 저장소에 저장하고, 저장해놓은 경로를 돌려주는 메서드
    @PostMapping("/preUpload")
    public ResponseEntity<?> filePreUpload(@RequestPart("multipartFile") MultipartFile multipartFile)
    {
        try {
            DisplayedFileDTO displayedFileDTO = fileService.filePreUpload(multipartFile);
            return new ResponseEntity<DisplayedFileDTO>(displayedFileDTO,HttpStatus.OK); //fixme
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }


    }

    // 게시물 내의 이미지를 가져오는 메서드
    @GetMapping("/downloadImg")
    public ResponseEntity<Resource> getImg(@RequestParam String filePath) {
        try {
            Resource resource = fileService.getFile(filePath);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "image/jpeg") // Adjust MIME type as needed
                    .body(resource);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    //파일을 서버에서 가져오는 메서드
    @GetMapping("/downloadFile")
    public ResponseEntity<Resource> downloadFile(@RequestParam String filePath) {
        try {
            // getFile 메서드를 통해 파일을 가져옵니다 (Resource 객체 반환)
            Resource resource = fileService.getFile(filePath);

            // resource가 null인지 확인
            if (resource == null || !resource.exists() || !resource.isReadable()) {
                throw new IOException("Could not read file from S3");
            }

            // 파일 이름을 URL-safe하게 인코딩합니다.
            String filename = Paths.get(filePath).getFileName().toString();

            // Remove the UUID part from the filename
            String originalFilename = filename.substring(filename.indexOf('_') + 1);

            String encodedFileName = UriUtils.encode(filename, StandardCharsets.UTF_8);

            // 다운로드를 위한 HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM); // 파일의 MIME 타입
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename(originalFilename, StandardCharsets.UTF_8)
                    .build()); // 파일 다운로드 시 파일 이름 설정

            // 바디에 Resource 객체를 설정하여 파일 콘텐츠 반환
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);

        } catch (Exception e) {
            log.error("Error downloading file for path: {}. Error: {}", filePath, e.toString());

            String errorMessage = "Error downloading file: " + e.getMessage();  // e.getMessage() 대신 e.toString() 사용
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ByteArrayResource(errorMessage.getBytes(StandardCharsets.UTF_8)));
        }
    }



}
