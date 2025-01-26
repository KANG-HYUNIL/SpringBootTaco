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
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;


import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


// /admin 경로로 들어오는 모든 로직 처리
@Service
@Slf4j
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
        try {
            SessionDTO newSessionDTO = new SessionDTO();
            newSessionDTO.setThumbnail(processThumbnail(sessionDTO.getThumbnail()));
            newSessionDTO.setTerm(sessionDTO.getTerm());
            newSessionDTO.setTitle(sessionDTO.getTitle());
            newSessionDTO.setContent(processContent(sessionDTO.getContent()));
            newSessionDTO.setAttachmentFilePaths(processAttachments(sessionDTO.getAttachmentFilePaths()));

            SessionDocument sessionDocument = DocumentConverter.toSessionDoc(newSessionDTO);
            sessionRepository.save(sessionDocument);
            log.info("Successfully saved session: Title={}", sessionDocument.getTitle());
        }
        catch (Exception e)
        {
            log.error("Error saving session: Title={}", sessionDTO.getTitle(), e);
            throw new RuntimeException(e);
        }
    }

    //Session 페이지 수정 메서드
    public void fixSession(SessionDTO sessionDTO) {
        try {
            SessionDocument existingSession = sessionRepository.findById(sessionDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Session not found"));

            existingSession.setTitle(sessionDTO.getTitle());
            existingSession.setTerm(sessionDTO.getTerm());
            existingSession.setThumbnail(processThumbnail(sessionDTO.getThumbnail()));
            existingSession.setContent(processContent(sessionDTO.getContent()));
            existingSession.setAttachmentFilePaths(processAttachments(sessionDTO.getAttachmentFilePaths()));

            sessionRepository.save(existingSession);
            log.info("Successfully updated session: Title={}", existingSession.getTitle());
        }
        catch (Exception e)
        {
            log.error("Error updating session: Title={}", sessionDTO.getTitle(), e);
            throw new RuntimeException(e);
        }
    }

    //Session 삭제 메서드
    public void deleteSession(SessionDTO sessionDTO)
    {
        try {
            SessionDocument existingSession = sessionRepository.findById(sessionDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Session not found"));

            sessionRepository.delete(existingSession);
            log.info("Successfully deleted session: Title={}", existingSession.getTitle());
        }
        catch (Exception e)
        {
            log.error("Error deleting session: Title={}", sessionDTO.getTitle(), e);
            throw new RuntimeException(e);
        }
    }

    //Project 페이지 작성 메서드
    public void writeProject(ProjectDTO projectDTO) {
        try {
            ProjectDTO newProjectDTO = new ProjectDTO();
            newProjectDTO.setThumbnail(processThumbnail(projectDTO.getThumbnail()));
            newProjectDTO.setTerm(projectDTO.getTerm());
            newProjectDTO.setTeam(projectDTO.getTeam());
            newProjectDTO.setTitle(projectDTO.getTitle());
            newProjectDTO.setContent(processContent(projectDTO.getContent()));
            newProjectDTO.setAttachmentFilePaths(processAttachments(projectDTO.getAttachmentFilePaths()));

            ProjectDocument projectDocument = DocumentConverter.toProjectDoc(newProjectDTO);
            projectRepository.save(projectDocument);
            log.info("Successfully saved project: Title={}", projectDocument.getTitle());
        }
        catch (Exception e)
        {
            log.error("Error writing project: Title={}", projectDTO.getTitle(), e);
            throw new RuntimeException(e);
        }
    }


    //Project 페이지 수정 메서드
    public void fixProject(ProjectDTO projectDTO) {
        try {
            ProjectDocument existingProject = projectRepository.findById(projectDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Project not found"));

            existingProject.setTitle(projectDTO.getTitle()); //제목 설정
            existingProject.setTerm(projectDTO.getTerm()); //기수 설정
            existingProject.setTeam(projectDTO.getTeam()); //팀 설정
            existingProject.setThumbnail(processThumbnail(projectDTO.getThumbnail())); //썸네일 이미지 설정
            existingProject.setContent(processContent(projectDTO.getContent())); //본문 설정
            existingProject.setAttachmentFilePaths(processAttachments(projectDTO.getAttachmentFilePaths()));

            projectRepository.save(existingProject);
            log.info("Successfully updated project: Title={}", existingProject.getTitle());
        }
        catch (Exception e)
        {
            log.error("Error updating project: Title={}", projectDTO.getTitle(), e);
            throw new RuntimeException(e);
        }
    }

    //Project 삭제 메서드
    public void deleteProject(ProjectDTO projectDTO)
    {
        try {
            ProjectDocument existingProject = projectRepository.findById(projectDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Project not found"));

            projectRepository.delete(existingProject);
            log.info("Successfully deleted project: Title={}", existingProject.getTitle());
        }
        catch (Exception e)
        {
            log.error("Error deleting project: Title={}", projectDTO.getTitle(), e);
            throw new RuntimeException(e);
        }
    }

    //썸네일 이미지 업로드 및 경로 설정 메서드
    private String processThumbnail(String thumbnail)
    {
        //썸네일 이미지를 예비 파일 경로에서 실제 파일 경로로 이동 및 파일 경로 갱신
        DisplayedFileDTO thumbnailFile = fileService.fileRealUpload(thumbnail);
        log.info("Successfully uploaded thumbnail: {} to {}", thumbnail, thumbnailFile.getFilePath());
        return (thumbnailFile != null) ? thumbnailFile.getFilePath() : thumbnail;
    }

    //본문 게시물 작성 요청 메서드
    private String processContent(String content) {

        //content가 비어있지 않다면
        if (!StringUtils.hasText(content))
        {
            return content;
        }

        //마크다운 이미지 구문을 찾기 위한 정규식
        Pattern pattern = Pattern.compile("!\\[image alt attribute\\]\\(/file/downloadImg\\?filePath=(.*?)\\)");
        Matcher matcher = pattern.matcher(content);
        StringBuffer newContent = new StringBuffer();

        //마크다운 이미지 구문을 찾아서 새로운 이미지 경로로 변경
        while (matcher.find())
        {
            String oldPath = matcher.group(1);
            DisplayedFileDTO fileDTO = fileService.fileRealUpload(oldPath);
            String newPath = (fileDTO != null) ? fileDTO.getFilePath() : oldPath;
            matcher.appendReplacement(newContent, "![](/file/downloadImg?filePath=" + newPath + ")");
            log.info("Successfully uploaded image: {} to {}", oldPath, newPath);
        }
        matcher.appendTail(newContent);

        return newContent.toString(); //업데이트된 이미지 경로로 새로운 content 반환
    }


    //첨부 파일 처리 메서드
    private List<String> processAttachments(List<String> attachmentFilePaths) {


        List<String> newAttachmentFilePaths = new ArrayList<>(); //새로운 첨부 파일 경로를 저장할 리스트
        for (String prePath : attachmentFilePaths)  //기존 첨부 파일 경로들을 하나씩 가져와서
        {
            DisplayedFileDTO fileDTO = fileService.fileRealUpload(prePath); //파일 서비스를 통해 실제 파일로 업로드
            newAttachmentFilePaths.add((fileDTO != null) ? fileDTO.getFilePath() : prePath);
            log.info("Successfully uploaded attachment: {} to {}", prePath, fileDTO.getFilePath());
        }
        return newAttachmentFilePaths; //새로운 첨부 파일 경로 리스트 반환
    }

}
