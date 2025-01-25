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
            // Create a new SessionDTO object
            SessionDTO newSessionDTO = new SessionDTO();

            // 썸네일 이미지 업로드 및 경로 설정
            DisplayedFileDTO thumbnailFile = fileService.fileRealUpload(sessionDTO.getThumbnail());
            if (thumbnailFile != null)
            {
                newSessionDTO.setThumbnail(thumbnailFile.getFilePath());
            }
            else
            {
                newSessionDTO.setThumbnail(sessionDTO.getThumbnail());
            }

            // term, title, attachmentFilePaths 설정
            newSessionDTO.setTerm(sessionDTO.getTerm());
            newSessionDTO.setTitle(sessionDTO.getTitle());
            //newSessionDTO.setAttachmentFilePaths(sessionDTO.getAttachmentFilePaths());

            // content 설정
            String content = sessionDTO.getContent();
            if (StringUtils.hasText(content))
            {
                // 마크다운 이미지 구문을 찾기 위한 정규식
                Pattern pattern = Pattern.compile("!\\[image alt attribute\\]\\(/file/downloadImg\\?filePath=(.*?)\\)");
                Matcher matcher = pattern.matcher(content);

                StringBuffer newContent = new StringBuffer();
                while (matcher.find())
                {
                    String oldPath = matcher.group(1);
                    DisplayedFileDTO fileDTO = fileService.fileRealUpload(oldPath);
                    String newPath = (fileDTO != null) ? fileDTO.getFilePath() : oldPath;
                    matcher.appendReplacement(newContent, "![](/file/downloadImg?filePath=" + newPath + ")");
                }
                matcher.appendTail(newContent);

                // 업데이트된 이미지 경로로 새로운 content 설정
                newSessionDTO.setContent(newContent.toString());
            }
            else
            {
                newSessionDTO.setContent(content);
            }


            // 첨부 파일 처리
            List<String> newAttachmentFilePaths = new ArrayList<>();
            for (String prePath : sessionDTO.getAttachmentFilePaths())
            {
                DisplayedFileDTO fileDTO = fileService.fileRealUpload(prePath);
                if (fileDTO != null)
                {
                    newAttachmentFilePaths.add(fileDTO.getFilePath());
                }
                else
                {
                    newAttachmentFilePaths.add(prePath);
                }
            }
            newSessionDTO.setAttachmentFilePaths(newAttachmentFilePaths);




            // Convert to SessionDocument
            SessionDocument sessionDocument = DocumentConverter.toSessionDoc(newSessionDTO);

            // Save to MongoDB
            sessionRepository.save(sessionDocument);
            log.info("Successfully saved session:, Title={}", sessionDocument.getTitle());
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
            // Retrieve the existing session document from the database
            SessionDocument existingSession = sessionRepository.findById(sessionDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Session not found"));

            // Update the existing session document with new data from the DTO
            existingSession.setTitle(sessionDTO.getTitle());
            existingSession.setTerm(sessionDTO.getTerm());

            // Update thumbnail
            DisplayedFileDTO thumbnailFile = fileService.fileRealUpload(sessionDTO.getThumbnail());
            if (thumbnailFile != null)
            {
                existingSession.setThumbnail(thumbnailFile.getFilePath());
            }
            else
            {
                existingSession.setThumbnail(sessionDTO.getThumbnail());
            }

            // Update content
            String content = sessionDTO.getContent();
            if (StringUtils.hasText(content))
            {
                Pattern pattern = Pattern.compile("!\\[image alt attribute\\]\\(/file/downloadImg\\?filePath=(.*?)\\)");
                Matcher matcher = pattern.matcher(content);

                StringBuffer newContent = new StringBuffer();
                while (matcher.find())
                {
                    String oldPath = matcher.group(1);
                    DisplayedFileDTO fileDTO = fileService.fileRealUpload(oldPath);
                    String newPath = (fileDTO != null) ? fileDTO.getFilePath() : oldPath;
                    matcher.appendReplacement(newContent, "![](/file/downloadImg?filePath=" + newPath + ")");
                }
                matcher.appendTail(newContent);

                existingSession.setContent(newContent.toString());
            }
            else
            {
                existingSession.setContent(content);
            }

            // Update attachment file paths
            List<String> newAttachmentFilePaths = new ArrayList<>();
            for (String prePath : sessionDTO.getAttachmentFilePaths())
            {
                DisplayedFileDTO fileDTO = fileService.fileRealUpload(prePath);
                if (fileDTO != null)
                {
                    newAttachmentFilePaths.add(fileDTO.getFilePath());
                }
                else
                {
                    newAttachmentFilePaths.add(prePath);
                }
            }
            existingSession.setAttachmentFilePaths(newAttachmentFilePaths);

            // Save the updated session document to the database
            sessionRepository.save(existingSession);
            log.info("Successfully updated session: Title={}", existingSession.getTitle());
        }
        catch (Exception e)
        {
            log.error("Error updating session: Title={}", sessionDTO.getTitle(), e);
            throw new RuntimeException(e);
        }
    }

    //Project 페이지 작성 메서드
    public void writeProject(ProjectDTO projectDTO) {

        try {
            // Create a new ProjectDTO object
            ProjectDTO newProjectDTO = new ProjectDTO();

            // Process thumbnail
            //썸네일 이미지를 예비 파일 경로에서 실제 파일 경로로 이동 및 파일 경로 갱신
            DisplayedFileDTO thumbnailFile = fileService.fileRealUpload(projectDTO.getThumbnail());
            if (thumbnailFile != null)
            {
                newProjectDTO.setThumbnail(thumbnailFile.getFilePath());
            }
            else
            {
                newProjectDTO.setThumbnail(projectDTO.getThumbnail());
            }

            // Copy term, team, and title, attachmentFilePaths
            newProjectDTO.setTerm(projectDTO.getTerm());
            newProjectDTO.setTeam(projectDTO.getTeam());
            newProjectDTO.setTitle(projectDTO.getTitle());
            //newProjectDTO.setAttachmentFilePaths(projectDTO.getAttachmentFilePaths());

            // Process content, 텍스트 에디터 내의 게시물 내용 부분 관리
            // content 설정
            String content = projectDTO.getContent();
            if (StringUtils.hasText(content))
            {
                // 마크다운 이미지 구문을 찾기 위한 정규식
                Pattern pattern = Pattern.compile("!\\[image alt attribute\\]\\(/file/downloadImg\\?filePath=(.*?)\\)");
                Matcher matcher = pattern.matcher(content);

                StringBuffer newContent = new StringBuffer();
                while (matcher.find())
                {
                    String oldPath = matcher.group(1);
                    DisplayedFileDTO fileDTO = fileService.fileRealUpload(oldPath);
                    String newPath = (fileDTO != null) ? fileDTO.getFilePath() : oldPath;
                    matcher.appendReplacement(newContent, "![](/file/downloadImg?filePath=" + newPath + ")");
                }
                matcher.appendTail(newContent);

                // 업데이트된 이미지 경로로 새로운 content 설정
                newProjectDTO.setContent(newContent.toString());
            }
            else
            {
                newProjectDTO.setContent(content);
            }

            // 첨부 파일 처리
            List<String> newAttachmentFilePaths = new ArrayList<>();
            for (String prePath : projectDTO.getAttachmentFilePaths())
            {
                DisplayedFileDTO fileDTO = fileService.fileRealUpload(prePath);
                if (fileDTO != null)
                {
                    newAttachmentFilePaths.add(fileDTO.getFilePath());
                }
                else
                {
                    newAttachmentFilePaths.add(prePath);
                }
            }
            newProjectDTO.setAttachmentFilePaths(newAttachmentFilePaths);


            // Convert to ProjectDocument
            ProjectDocument projectDocument = DocumentConverter.toProjectDoc(newProjectDTO);

            // Save to MongoDB
            projectRepository.save(projectDocument);

            log.info("Successfully saved project:, Title={}",  projectDocument.getTitle());

        }catch (Exception e)
        {
            log.error("Error writing project: Title={}", projectDTO.getTitle(), e);
            throw new RuntimeException(e);
        }

    }


    //Project 페이지 수정 메서드
    public void fixProject(ProjectDTO projectDTO) {
        try {
            // Retrieve the existing project document from the database
            ProjectDocument existingProject = projectRepository.findById(projectDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Project not found"));

            // Update the existing project document with new data from the DTO
            existingProject.setTitle(projectDTO.getTitle());
            existingProject.setTerm(projectDTO.getTerm());
            existingProject.setTeam(projectDTO.getTeam());

            // Update thumbnail
            DisplayedFileDTO thumbnailFile = fileService.fileRealUpload(projectDTO.getThumbnail());
            if (thumbnailFile != null)
            {
                existingProject.setThumbnail(thumbnailFile.getFilePath());
            }
            else
            {
                existingProject.setThumbnail(projectDTO.getThumbnail());
            }

            // Update content
            String content = projectDTO.getContent();
            if (StringUtils.hasText(content))
            {
                Pattern pattern = Pattern.compile("!\\[image alt attribute\\]\\(/file/downloadImg\\?filePath=(.*?)\\)");
                Matcher matcher = pattern.matcher(content);

                StringBuffer newContent = new StringBuffer();
                while (matcher.find())
                {
                    String oldPath = matcher.group(1);
                    DisplayedFileDTO fileDTO = fileService.fileRealUpload(oldPath);
                    String newPath = (fileDTO != null) ? fileDTO.getFilePath() : oldPath;
                    matcher.appendReplacement(newContent, "![](/file/downloadImg?filePath=" + newPath + ")");
                }
                matcher.appendTail(newContent);

                existingProject.setContent(newContent.toString());
            }
            else
            {
                existingProject.setContent(content);
            }

            // Update attachment file paths
            List<String> newAttachmentFilePaths = new ArrayList<>();
            for (String prePath : projectDTO.getAttachmentFilePaths())
            {
                DisplayedFileDTO fileDTO = fileService.fileRealUpload(prePath);
                if (fileDTO != null)
                {
                    newAttachmentFilePaths.add(fileDTO.getFilePath());
                }
                else
                {
                    newAttachmentFilePaths.add(prePath);
                }
            }
            existingProject.setAttachmentFilePaths(newAttachmentFilePaths);

            // Save the updated project document to the database
            projectRepository.save(existingProject);
            log.info("Successfully updated project: Title={}", existingProject.getTitle());
        }
        catch (Exception e)
        {
            log.error("Error updating project: Title={}", projectDTO.getTitle(), e);
            throw new RuntimeException(e);
        }
    }

}
