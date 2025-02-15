package com.Kang.SpringBoot_Jpa.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import com.amazonaws.services.s3.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import com.Kang.SpringBoot_Jpa.dto.DisplayedFileDTO;
import com.amazonaws.services.s3.AmazonS3;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

//모든 파일(이미지, 동영상) 업로드 관리 Service
@Service
@Slf4j
public class FileService {

    //저장소의 경로는 이후에 서버를 클라우드에 적재 시 변경해야 함. S3로 대체 예정.
    private final AmazonS3 amazonS3;
    private final String bucket;
    private final String tempBucket;

    @Autowired
    public FileService(AmazonS3 amazonS3, @Value("${cloud.aws.s3.bucket}")String bucket, @Value("${cloud.aws.s3.tempbucket}")String tempBucket) {
        this.amazonS3 = amazonS3;
        this.bucket = bucket;
        this.tempBucket = tempBucket;
    }




    //MultipartFile을 S3 저장을 위해 File 로 변환 및 UUID 부여
    private File convertToFile(MultipartFile multipartFile) throws IOException
    {
        String originalFileName = multipartFile.getOriginalFilename();

        // UUID
        String uniqueId = UUID.randomUUID().toString();
        String uniqueFileName = uniqueId + "_" + originalFileName; // UUID와 원본 파일 이름 결합

        File convertFile = new File(uniqueFileName); // File 객체 생성

        //파일에 쓰기 작업 개시
        if (convertFile.createNewFile())
        {
            try (FileOutputStream fos = new FileOutputStream(convertFile)) {
                fos.write(multipartFile.getBytes());
            } catch (IOException e) {
                log.error("파일 변환 중 오류 발생: {}", e.getMessage());
                throw e;
            }
            return convertFile; //쓰기 작업을 완료한 file 반환
        }

        throw new IllegalArgumentException("파일 변환 실패");

    }

    @Transactional
    //미리 저장소에 파일 저장하고 저장된 파일 경로 반환
    public DisplayedFileDTO filePreUpload(MultipartFile multipartFile) {
        try {

            //fixme

            File preUploadFile = convertToFile(multipartFile); //파일 변환
            String fileName = preUploadFile.getName().replace(".", "_"); //파일 이름 획득

            String preUploadFilePath = putFileToS3(preUploadFile, fileName, tempBucket); //파일을 S3에 저장하고 저장된 파일 경로 반환

            DisplayedFileDTO displayedFileDTO = new DisplayedFileDTO(); //DTO 객체 생성
            displayedFileDTO.setFileName(fileName); //파일 이름 설정
            displayedFileDTO.setFilePath(preUploadFilePath); //파일 경로 설정

            removeNewFile(preUploadFile); //임시 파일 삭제

            log.info("File pre-upload successful: FileName={}, FilePath={}", fileName, preUploadFilePath);
            return displayedFileDTO; //저장된 파일 경로 반환

        } catch (Exception e) {
            log.error("File pre-upload failed: Error={}", e.getMessage(), e);
            throw new IllegalArgumentException("파일 업로드 실패 " + e);
        }

    }

    @Transactional
    //이미지가 저장되어 있는 예비 파일 경로를 받으면, 그 경로에 있는 파일을 실제 저장소의 위치로 옮기고, 그 파일의 실제 저장소 경로를 반환
    //실제 저장소 경로를 반환받은 후에 그 경로를 게시물 본문에 끼어 있는 img나 video 태그의 src 속성에 넣어 갱신시켜줘야 함
    public DisplayedFileDTO fileRealUpload(String filePrePath)
    {
        try {// 파일 경로를 디코딩하여 원래의 파일 경로로 변환
            String decodedFilePath = URLDecoder.decode(filePrePath, StandardCharsets.UTF_8);

            String realFileName = transferFileFromTempToReal(tempBucket, bucket, decodedFilePath); //예비 s3에서 실제 s3로 파일 이동 및 파일 이름 반환

            DisplayedFileDTO displayedFileDTO = new DisplayedFileDTO(); //DTO 객체 생성
            displayedFileDTO.setFileName(realFileName); //파일 이름 설정
            displayedFileDTO.setFilePath(realFileName); //파일 경로 설정

            log.info("File real-upload successful: FileName={}, FilePath={}", realFileName, realFileName);
            return displayedFileDTO; //저장된 파일 경로 반환

        } catch (Exception e) {
            log.error("File pre-upload failed: Error={}", e.getMessage(), e);
            throw new IllegalArgumentException("파일 업로드 실패 " + e);
        }
    }

    //저장소에서 해당 파일을 가져와 돌려주는 메서드
    //File, cURL 등을 처리하는 Resource 클래스 채용
    //fixme
    public Resource getFile(String filePath) {
        try {

            // 파일 경로를 디코딩하여 원래의 파일 경로로 변환
            String decodedFilePath = URLDecoder.decode(filePath, StandardCharsets.UTF_8);
            log.info("Decoded file path: {}", decodedFilePath);
            S3Object s3Object = null;

            try
            {
                // 메인 S3 버킷에서 파일 가져오기
                s3Object = amazonS3.getObject(bucket, decodedFilePath);
            }
            catch (AmazonS3Exception e)
            {
                if (e.getStatusCode() == 404)
                {
                    // 첫 번째 S3 버킷에서 파일을 찾지 못하면 예비 S3 버킷에서 파일 가져오기
                    s3Object = amazonS3.getObject(tempBucket, decodedFilePath);
                }
                else
                {
                    throw e;
                }
            }

            if (s3Object == null) {
                throw new IOException("Could not find file in S3");
            }

            // S3Object에서 파일의 InputStream을 가져오고, 이를 Resource로 변환
            byte[] content = s3Object.getObjectContent().readAllBytes();
            Resource resource = new ByteArrayResource(content);

            if (!resource.exists() || !resource.isReadable())
            {
                throw new IOException("Could not read file from S3" );
            }
            return resource;

        }
        catch (Exception e) {
            log.error("File pre-upload failed: Error={}", e.getMessage(), e);
            throw new IllegalArgumentException("파일 Get 실패 " + e);
        }
    }

    //aws s3에 파일 저장 메서드
    private String putFileToS3(File uploadFile, String fileName, String bucketName)
    {
        //실 s3에 저장?
        amazonS3.putObject(new PutObjectRequest(bucketName, fileName, uploadFile));
        return fileName;
    }

    //S3에서 파일명을 통해 파일 제거 메서드
    private void deleteFileAtS3(String fileName, String bucketName)
    {
        try {
            DeleteObjectRequest deleteObjectRequest = new DeleteObjectRequest(bucketName, fileName);
            amazonS3.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            log.error("File deletion failed: FileName={}, Error={}", fileName, e.getMessage(), e);
            throw new RuntimeException("File deletion failed " + e);
        }
    }

    //서버에서 파일 처리를 위해 임시로 생성한 File 객체를 삭제하는 메서드
    private void removeNewFile(File targetFile) {
        if (targetFile.delete()) 
        {
            log.info("파일이 삭제되었습니다.");
            return;
        }
            
        log.error("파일이 삭제되지 못했습니다.");
    }

    //파일을 예비 s3에서 실제 s3로 이동하고, 예비 s3에서 파일을 삭제하는 메서드
    private String transferFileFromTempToReal(String tempBucket, String realBucket, String fileName)
    {
        try {
            //파일 복사 요청 객체 생성
            CopyObjectRequest copyObjectRequest = new CopyObjectRequest(tempBucket, fileName, realBucket, fileName);
            amazonS3.copyObject(copyObjectRequest); //파일 복사 요청

            deleteFileAtS3(fileName, tempBucket); //예비 s3에서 파일 삭제
            log.info("File transfer from temp to real successful: FileName={}", fileName);
            return fileName;
        } catch (Exception e) {
            log.error("Error during file transfer: Error={}" , e.getMessage(), e);
//            e.printStackTrace();
            //throw new RuntimeException("파일 전송 중 오류 발생: " + e.getMessage(), e);
            return fileName;
        }
    }



}
