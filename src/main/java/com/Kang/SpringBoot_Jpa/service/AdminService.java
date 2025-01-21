package com.Kang.SpringBoot_Jpa.service;

import com.Kang.SpringBoot_Jpa.Converter.DocumentConverter;
import com.Kang.SpringBoot_Jpa.document.ProjectDocument;
import com.Kang.SpringBoot_Jpa.document.SessionDocument;
import com.Kang.SpringBoot_Jpa.dto.DisplayedFileDTO;
import com.Kang.SpringBoot_Jpa.dto.ProjectDTO;
import com.Kang.SpringBoot_Jpa.dto.SessionDTO;
import com.Kang.SpringBoot_Jpa.mongorepo.ProjectRepository;
import com.Kang.SpringBoot_Jpa.mongorepo.SessionRepository;
import jakarta.mail.Session;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;


import java.util.regex.Matcher;
import java.util.regex.Pattern;


// /admin 경로로 들어오는 모든 로직 처리
@Service
public class AdminService {

    //FileService 객체 주입
    private final FileService fileService;

    private final SessionRepository sessionRepository;

    private final ProjectRepository projectRepository;

    public AdminService(FileService fileService, SessionRepository sessionRepository, ProjectRepository projectRepository)
    {
        this.fileService = fileService;
        this.sessionRepository = sessionRepository;
        this.projectRepository = projectRepository;
    }



    //홍보 문구 페이지 작성 메서드


    //홍보 문구 페이지 수정 메서드


    //Session 페이지 작성 메서드
    public void writeSession(SessionDTO sessionDTO) {
        // Create a new SessionDTO object
        SessionDTO newSessionDTO = new SessionDTO();

        // 썸네일 이미지 업로드 및 경로 설정
        DisplayedFileDTO thumbnailFile = fileService.fileRealUpload(sessionDTO.getThumbnail());
        if (thumbnailFile != null) {
            newSessionDTO.setThumbnail(thumbnailFile.getFilePath());
        } else {
            newSessionDTO.setThumbnail(sessionDTO.getThumbnail());
        }

        // term, title, attachmentFilePaths 설정
        newSessionDTO.setTerm(sessionDTO.getTerm());
        newSessionDTO.setTitle(sessionDTO.getTitle());
        newSessionDTO.setAttachmentFilePaths(sessionDTO.getAttachmentFilePaths());

        // content 설정
        String content = sessionDTO.getContent();
        if (StringUtils.hasText(content)) {
            Document doc = Jsoup.parse(content); //Jsoup을 통한 HTML 파싱
            Elements mediaElements = doc.select("img[src], video[src]"); // img, video 태그 선택

            // 이미지, 동영상 파일 업로드 및 경로 설정
            for (Element mediaElement : mediaElements) {
                String src = mediaElement.attr("src"); // src 속성 추출
                DisplayedFileDTO fileDTO = fileService.fileRealUpload(src); // 파일 업로드 및 경로 설정
                String newSrc = (fileDTO != null) ? fileDTO.getFilePath() : src; // 파일 경로 설정
                mediaElement.attr("src", newSrc); // src 속성 갱신
            }
            // content 설정
            newSessionDTO.setContent(doc.body().html());
        }
        else {
            newSessionDTO.setContent(content);
        }

        // Convert to SessionDocument
        SessionDocument sessionDocument = DocumentConverter.toSessionDoc(newSessionDTO);

        // Save to MongoDB
        sessionRepository.save(sessionDocument);
    }

    //Session 페이지 수정 메서드
    public void fixSession(SessionDTO sessionDTO) {
        // Retrieve the existing SessionDocument from MongoDB
        SessionDocument sessionDocument = sessionRepository.findById(sessionDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        // Update the fields with the values from the SessionDTO
        sessionDocument.setThumbnail(sessionDTO.getThumbnail());
        sessionDocument.setTerm(sessionDTO.getTerm());
        sessionDocument.setTitle(sessionDTO.getTitle());
        sessionDocument.setContent(sessionDTO.getContent());
        sessionDocument.setAttachmentFilePaths(sessionDTO.getAttachmentFilePaths());

        // Save the updated document back to MongoDB
        sessionRepository.save(sessionDocument);
    }

    //Project 페이지 작성 메서드
    public void writeProject(ProjectDTO projectDTO) {
        // Create a new ProjectDTO object
        ProjectDTO newProjectDTO = new ProjectDTO();

        // Process thumbnail
        //썸네일 이미지를 예비 파일 경로에서 실제 파일 경로로 이동 및 파일 경로 갱신
        DisplayedFileDTO thumbnailFile = fileService.fileRealUpload(projectDTO.getThumbnail());
        if (thumbnailFile != null)
        {
            newProjectDTO.setThumbnail(thumbnailFile.getFilePath());
        } else
        {
            newProjectDTO.setThumbnail(projectDTO.getThumbnail());
        }

        // Copy term, team, and title, attachmentFilePaths
        newProjectDTO.setTerm(projectDTO.getTerm());
        newProjectDTO.setTeam(projectDTO.getTeam());
        newProjectDTO.setTitle(projectDTO.getTitle());
        newProjectDTO.setAttachmentFilePaths(projectDTO.getAttachmentFilePaths());

        // Process content, 텍스트 에디터 내의 게시물 내용 부분 관리
        String content = projectDTO.getContent();
        if (StringUtils.hasText(content)) {
            // Parse the HTML content using Jsoup
            Document doc = Jsoup.parse(content);
            Elements mediaElements = doc.select("img[src], video[src]");

            //이미지 태그들에 대해 예비 파일 경로에서 실제 저장 경로로 이동 후 경로 수정
            for (Element mediaElement : mediaElements) {
                String src = mediaElement.attr("src");
                DisplayedFileDTO fileDTO = fileService.fileRealUpload(src);
                String newSrc = (fileDTO != null) ? fileDTO.getFilePath() : src;
                mediaElement.attr("src", newSrc);
            }

            // content 설정
            newProjectDTO.setContent(doc.body().html());
        }
        else {
            newProjectDTO.setContent(content);
        }

        // Convert to ProjectDocument
        ProjectDocument projectDocument = DocumentConverter.toProjectDoc(newProjectDTO);

        // Save to MongoDB
        projectRepository.save(projectDocument);
    }


    //Project 페이지 수정 메서드
    public void fixProject(ProjectDTO projectDTO) {
        // Retrieve the existing ProjectDocument from MongoDB
        ProjectDocument projectDocument = projectRepository.findById(projectDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Update the fields with the values from the ProjectDTO
        projectDocument.setThumbnail(projectDTO.getThumbnail());
        projectDocument.setTerm(projectDTO.getTerm());
        projectDocument.setTeam(projectDTO.getTeam());
        projectDocument.setTitle(projectDTO.getTitle());
        projectDocument.setContent(projectDTO.getContent());
        projectDocument.setAttachmentFilePaths(projectDTO.getAttachmentFilePaths());

        // Save the updated document back to MongoDB
        projectRepository.save(projectDocument);
    }

}
