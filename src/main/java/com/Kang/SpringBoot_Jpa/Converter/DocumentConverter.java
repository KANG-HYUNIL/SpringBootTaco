package com.Kang.SpringBoot_Jpa.Converter;

import com.Kang.SpringBoot_Jpa.document.ProjectDocument;
import com.Kang.SpringBoot_Jpa.document.SessionDocument;
import com.Kang.SpringBoot_Jpa.dto.ProjectDTO;
import com.Kang.SpringBoot_Jpa.dto.SessionDTO;
import org.springframework.security.core.parameters.P;

//Document 와 DTO 변경 메서드 관리 클래스
public class DocumentConverter {

    //Session DTO를 Session Document로 변환
    public static SessionDocument toSessionDoc(SessionDTO sessionDTO)
    {
        SessionDocument sessionDocument = new SessionDocument();

        String id = sessionDTO.getId();
        if (id != null)
        {
            sessionDocument.setId(id);
        }
        sessionDocument.setTerm(sessionDTO.getTerm());
        sessionDocument.setThumbnail(sessionDTO.getThumbnail());
        sessionDocument.setTitle((sessionDTO.getTitle()));
        sessionDocument.setContent(sessionDTO.getContent());
        sessionDocument.setAttachmentFilePaths(sessionDTO.getAttachmentFilePaths());

        return sessionDocument;
    }

    //Session Document를 Session DTO로 변환
    public static SessionDTO toSessionDTO(SessionDocument sessionDocument)
    {
        SessionDTO sessionDTO = new SessionDTO();

        sessionDTO.setId(sessionDocument.getId());
        sessionDTO.setTerm(sessionDocument.getTerm());
        sessionDTO.setThumbnail(sessionDocument.getThumbnail());
        sessionDTO.setTitle(sessionDocument.getTitle());
        sessionDTO.setContent(sessionDocument.getContent());
        sessionDTO.setAttachmentFilePaths(sessionDocument.getAttachmentFilePaths());

        return sessionDTO;
    }

    //Project DTO를 Project Document로 변환
    public static ProjectDocument toProjectDoc(ProjectDTO projectDTO)
    {
        ProjectDocument projectDocument = new ProjectDocument();

        String id = projectDTO.getId();
        if (id != null)
        {
            projectDocument.setId(id);
        }
        projectDocument.setTerm(projectDTO.getTerm());
        projectDocument.setThumbnail(projectDTO.getThumbnail());
        projectDocument.setTeam(projectDTO.getTeam());
        projectDocument.setTitle(projectDTO.getTitle());
        projectDocument.setContent(projectDTO.getContent());
        projectDocument.setAttachmentFilePaths(projectDTO.getAttachmentFilePaths());

        return projectDocument;
    }

    //Project Document를 Project DTO로 변환
    public static ProjectDTO toProjectDTO(ProjectDocument projectDocument)
    {
        ProjectDTO projectDTO = new ProjectDTO();

        projectDTO.setId(projectDocument.getId());
        projectDTO.setTerm(projectDocument.getTerm());
        projectDTO.setThumbnail(projectDocument.getThumbnail());
        projectDTO.setTeam(projectDocument.getTeam());
        projectDTO.setTitle(projectDocument.getTitle());
        projectDTO.setContent(projectDocument.getContent());
        projectDTO.setAttachmentFilePaths(projectDocument.getAttachmentFilePaths());

        return projectDTO;
    }


}
