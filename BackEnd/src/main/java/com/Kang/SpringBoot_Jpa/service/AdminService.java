package com.Kang.SpringBoot_Jpa.service;

import com.Kang.SpringBoot_Jpa.Converter.DocumentConverter;
import com.Kang.SpringBoot_Jpa.document.ApplicationDocument;
import com.Kang.SpringBoot_Jpa.document.ProjectDocument;
import com.Kang.SpringBoot_Jpa.document.SessionDocument;
import com.Kang.SpringBoot_Jpa.dto.*;
import com.Kang.SpringBoot_Jpa.entity.UserEntity;
import com.Kang.SpringBoot_Jpa.exception.DuplicateDataException;
import com.Kang.SpringBoot_Jpa.exception.NoDataException;
import com.Kang.SpringBoot_Jpa.jwt.JwtUtil;
import com.Kang.SpringBoot_Jpa.mongorepo.ApplicationRepository;
import com.Kang.SpringBoot_Jpa.mongorepo.ProjectRepository;
import com.Kang.SpringBoot_Jpa.mongorepo.SessionRepository;
import com.Kang.SpringBoot_Jpa.repository.UserRepository;
import jakarta.mail.Session;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;


import java.util.ArrayList;
import java.util.Collections;
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
    private final ApplicationRepository applicationRepository;

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AdminService(FileService fileService,
                        SessionRepository sessionRepository,
                        ProjectRepository projectRepository,
                        UserRepository userRepository,
                        JwtUtil jwtUtil,
                        ApplicationRepository applicationRepository)
    {
        this.fileService = fileService;
        this.sessionRepository = sessionRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.applicationRepository = applicationRepository;
    }



    //홍보 문구 페이지 작성 메서드


    //홍보 문구 페이지 수정 메서드


    //Session 페이지 작성 메서드
    public void writeSession(SessionDTO sessionDTO, String accessToken) {
        //String username = null;
        try {
            //username = jwtUtil.getUsername(accessToken);
            SessionDTO newSessionDTO = new SessionDTO();
            newSessionDTO.setThumbnail(processThumbnail(sessionDTO.getThumbnail()));
            newSessionDTO.setTerm(sessionDTO.getTerm());
            newSessionDTO.setTitle(sessionDTO.getTitle());
            newSessionDTO.setContent(processContent(sessionDTO.getContent()));
            newSessionDTO.setAttachmentFilePaths(processAttachments(sessionDTO.getAttachmentFilePaths()));

            SessionDocument sessionDocument = DocumentConverter.toSessionDoc(newSessionDTO);
            sessionRepository.save(sessionDocument);
            //log.info("Successfully saved session: Title={}, id={}", sessionDocument.getTitle(), username);
        } catch (Exception e) {
            //log.error("Error saving session: Title={}, id={}", sessionDTO.getTitle(), username, e);
            throw new RuntimeException(e);
        }
    }

    //Session 페이지 수정 메서드
    public void fixSession(SessionDTO sessionDTO, String accessToken) {
        String username = null;
        try {
             username = jwtUtil.getUsername(accessToken);
            SessionDocument existingSession = sessionRepository.findById(sessionDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Session not found"));

            existingSession.setTitle(sessionDTO.getTitle());
            existingSession.setTerm(sessionDTO.getTerm());
            existingSession.setThumbnail(processThumbnail(sessionDTO.getThumbnail()));
            existingSession.setContent(processContent(sessionDTO.getContent()));
            existingSession.setAttachmentFilePaths(processAttachments(sessionDTO.getAttachmentFilePaths()));

            sessionRepository.save(existingSession);
            //log.info("Successfully updated session: Title={}, id={}", existingSession.getTitle(), username);
        } catch (Exception e) {
            //log.error("Error updating session: Title={}, id={}", sessionDTO.getTitle(), username, e);
            throw new RuntimeException(e);
        }
    }

    //Session 삭제 메서드
    public void deleteSession(SessionDTO sessionDTO, String accessToken) {
        String username = jwtUtil.getUsername(accessToken);
        try {
            SessionDocument existingSession = sessionRepository.findById(sessionDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Session not found"));

            sessionRepository.delete(existingSession);
            //log.info("Successfully deleted session: Title={}, id={}", existingSession.getTitle(), username);
        } catch (Exception e) {
            //log.error("Error deleting session: Title={}, id={}", sessionDTO.getTitle(), username, e);
            throw new RuntimeException(e);
        }
    }

    //Project 페이지 작성 메서드
    public void writeProject(ProjectDTO projectDTO, String accessToken) {
        //String username = jwtUtil.getUsername(accessToken);
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
            //log.info("Successfully saved project: Title={}, id={}", projectDocument.getTitle(), username);
        } catch (Exception e) {
            //log.error("Error writing project: Title={}, id={}", projectDTO.getTitle(), username, e);
            throw new RuntimeException(e);
        }
    }


    //Project 페이지 수정 메서드
    public void fixProject(ProjectDTO projectDTO, String accessToken) {
       // String username = jwtUtil.getUsername(accessToken);
        try {
            ProjectDocument existingProject = projectRepository.findById(projectDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Project not found"));

            existingProject.setTitle(projectDTO.getTitle());
            existingProject.setTerm(projectDTO.getTerm());
            existingProject.setTeam(projectDTO.getTeam());
            existingProject.setThumbnail(processThumbnail(projectDTO.getThumbnail()));
            existingProject.setContent(processContent(projectDTO.getContent()));
            existingProject.setAttachmentFilePaths(processAttachments(projectDTO.getAttachmentFilePaths()));

            projectRepository.save(existingProject);
            //log.info("Successfully updated project: Title={}, id={}", existingProject.getTitle(), username);
        }
        catch (Exception e)
        {
            //log.error("Error updating project: Title={}, id={}", projectDTO.getTitle(), username, e);
            throw new RuntimeException(e);
        }
    }

    //Project 삭제 메서드
    public void deleteProject(ProjectDTO projectDTO, String accessToken) {
        //String username = null;
        try {
             //sername = jwtUtil.getUsername(accessToken);
            ProjectDocument existingProject = projectRepository.findById(projectDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Project not found"));

            projectRepository.delete(existingProject);
            //log.info("Successfully deleted project: Title={}, id={}", existingProject.getTitle(), username);
        } catch (Exception e) {
            //log.error("Error deleting project: Title={}, id={}", projectDTO.getTitle(), username, e);
            throw new RuntimeException(e);
        }
    }

    //Application 작성 메서드
    public void writeApplication(ApplicationDTO applicationDTO, String accessToken) {
        //String username = null;
        try {
             //username = jwtUtil.getUsername(accessToken);

            ApplicationDTO newApplicationDTO = new ApplicationDTO();
            newApplicationDTO.setTitle(applicationDTO.getTitle());
            newApplicationDTO.setStartTime(applicationDTO.getStartTime());
            newApplicationDTO.setEndTime(applicationDTO.getEndTime());
            newApplicationDTO.setContent(processContent(applicationDTO.getContent()));
            newApplicationDTO.setAttachmentFilePaths(processAttachments(applicationDTO.getAttachmentFilePaths()));
            newApplicationDTO.setSubmitters(Collections.emptyList());

            ApplicationDocument applicationDocument = DocumentConverter.toApplicationDoc(newApplicationDTO);
            applicationRepository.save(applicationDocument);
            //log.info("Successfully saved application: Title={}, id={}", applicationDocument.getTitle(), username);
        } catch (Exception e) {
            //log.error("Error saving application: Title={}, id={}", applicationDTO.getTitle(), username, e);
            throw new RuntimeException(e);
        }
    }

    //Application 삭제 메서드
    public void deleteApplication(ApplicationDTO applicationDTO, String accessToken) {
        //String username = null;
        try {
             //username = jwtUtil.getUsername(accessToken);

            ApplicationDocument existingApplication = applicationRepository.findById(applicationDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Application not found"));

            applicationRepository.delete(existingApplication);
            //log.info("Successfully deleted application: Title={}, id={}", existingApplication.getTitle(), username);
        } catch (Exception e) {
            //log.error("Error deleting application: Title={}, id={}", applicationDTO.getTitle(), username, e);
            throw new RuntimeException(e);
        }
    }

    public void fixApplication(ApplicationDTO applicationDTO, String accessToken) {

        //String username = null;
        try
        {
            //username = jwtUtil.getUsername(accessToken);

            ApplicationDocument existingApplication = applicationRepository.findById(applicationDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Application not found"));

            existingApplication.setTitle(applicationDTO.getTitle());
            existingApplication.setStartTime(applicationDTO.getStartTime());
            existingApplication.setEndTime(applicationDTO.getEndTime());
            existingApplication.setContent(processContent(applicationDTO.getContent()));
            existingApplication.setAttachmentFilePaths(processAttachments(applicationDTO.getAttachmentFilePaths()));

            applicationRepository.save(existingApplication);
            //log.info("Successfully updated application: Title={}, id={}", existingApplication.getTitle(), username);
        }
        catch (Exception e)
        {
            //log.error("Error updating application: Title={}, id={}", applicationDTO.getTitle(), username, e);
            throw new RuntimeException(e);
        }
    }


    //썸네일 이미지 업로드 및 경로 설정 메서드
    private String processThumbnail(String thumbnail)
    {
        if (!StringUtils.hasText(thumbnail))
        {
            return thumbnail;
        }

        //썸네일 이미지를 예비 파일 경로에서 실제 파일 경로로 이동 및 파일 경로 갱신
        DisplayedFileDTO thumbnailFile = fileService.fileRealUpload(thumbnail);
        log.info("Successfully uploaded thumbnail: {} to {}", thumbnail, thumbnailFile.getFilePath());
        return (thumbnailFile != null) ? thumbnailFile.getFilePath() : thumbnail;
    }

    //본문 게시물 작성 요청 메서드
    private String processContent(String content) {

        //content가 비어있
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
            if (!StringUtils.hasText(prePath)) //경로가 비어있으면
            {
                newAttachmentFilePaths.add(prePath); //새로운 경로 리스트에 추가
                continue;
            }

            DisplayedFileDTO fileDTO = fileService.fileRealUpload(prePath); //파일 서비스를 통해 실제 파일로 업로드
            newAttachmentFilePaths.add((fileDTO != null) ? fileDTO.getFilePath() : prePath);
            log.info("Successfully uploaded attachment: {} to {}", prePath, fileDTO.getFilePath());
        }
        return newAttachmentFilePaths; //새로운 첨부 파일 경로 리스트 반환
    }

    //ROLE_USER 설정 메서드
    public void setRoleUser(UserDTO userDTO, String accessToken) {
        String username = jwtUtil.getUsername(accessToken);
        UserEntity userEntity = userRepository.findById(userDTO.getId())
                .orElseThrow(() -> new NoDataException("User not found"));

        String roleUser = "ROLE_USER";

        if (roleUser.equals(userEntity.getRole())) {
            throw new DuplicateDataException("User already has ROLE_USER");
        }

        userEntity.setRole(roleUser);
        userRepository.save(userEntity);
        log.info("Successfully set role to ROLE_USER for user: {}, id={}", userEntity.getId(), username);
    }

    //ROLE_ADMIN 설정 메서드
    public void setRoleAdmin(UserDTO userDTO, String accessToken) {
        String username = jwtUtil.getUsername(accessToken);
        UserEntity userEntity = userRepository.findById(userDTO.getId())
                .orElseThrow(() -> new NoDataException("User not found"));

        String roleAdmin = "ROLE_ADMIN";

        if (roleAdmin.equals(userEntity.getRole())) {
            throw new DuplicateDataException("User already has ROLE_ADMIN");
        }

        userEntity.setRole(roleAdmin);
        userRepository.save(userEntity);
        log.info("Successfully set role to ROLE_ADMIN for user: {}, id={}", userEntity.getId(), username);
    }

}
