package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.dto.DisplayedFileDTO;
import com.Kang.SpringBoot_Jpa.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;


//
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

    // 게시물 내의 동영상을 가져오는 메서드
    @GetMapping("/downloadVideo")
    public ResponseEntity<Resource> getVideo(@RequestBody DisplayedFileDTO displayedFileDTO) {
        try {
            Resource resource = fileService.getFile(displayedFileDTO.getFilePath());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    //파일을 서버에서 가져오는 메서드
    @GetMapping("/downloadFile")
    public ResponseEntity<Resource> downloadFile(@RequestParam String filePath) {
        try {

            Resource resource = fileService.getFile(filePath);

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            }
            else
            {
                throw new RuntimeException("File not found or not readable");
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



}
