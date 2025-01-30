package com.Kang.SpringBoot_Jpa.service;

import com.Kang.SpringBoot_Jpa.Converter.DocumentConverter;
import com.Kang.SpringBoot_Jpa.document.ApplicationDocument;
import com.Kang.SpringBoot_Jpa.document.ProjectDocument;
import com.Kang.SpringBoot_Jpa.document.SessionDocument;
import com.Kang.SpringBoot_Jpa.dto.ApplicationDTO;
import com.Kang.SpringBoot_Jpa.dto.ApplicationSummaryDTO;
import com.Kang.SpringBoot_Jpa.dto.ProjectDTO;
import com.Kang.SpringBoot_Jpa.dto.SessionDTO;
import com.Kang.SpringBoot_Jpa.mongorepo.ApplicationRepository;
import com.Kang.SpringBoot_Jpa.mongorepo.ProjectRepository;
import com.Kang.SpringBoot_Jpa.mongorepo.SessionRepository;
import jakarta.mail.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MainService {

    private final ProjectRepository projectRepository;
    private final SessionRepository sessionRepository;
    private final ApplicationRepository applicationRepository;


    //모든 Session 게시물 데이터 가지고 와서 Term 으로 묶어 반환하는 메서드
    public Map<String, List<SessionDTO>> getSessionGroupByTerm()
    {
        //모든 Session 데이터 가져오기
        List<SessionDocument> sessionDocuments = sessionRepository.findAll();

        //stream 생성, 그룹화한 데이터들을 mapping 메서드 통해 DTO 로 변환 후에 List에 보관
        return sessionDocuments.stream()
                .collect(Collectors.groupingBy( //term을 기준으로 그룹화
                        SessionDocument::getTerm, //SessionDTO로 변환하여 반환
                        Collectors.mapping(DocumentConverter::toSessionDTO, Collectors.toList())
                ));

    }

    public Map<String, List<ProjectDTO>> getProjectGroupByTerm()
    {
        //모든 Project 데이터 가져오기
        List<ProjectDocument> projectDocuments = projectRepository.findAll();

        return projectDocuments.stream()
                .collect(Collectors.groupingBy(
                        ProjectDocument::getTerm,
                        Collectors.mapping(DocumentConverter::toProjectDTO, Collectors.toList())
                ));


    }

    //특정 ID의 Session 데이터 가져오기
    public SessionDTO getSessionById(SessionDTO sessionDTO)
    {
        //SessionDocument로부터 ID로 데이터 가져오기
        SessionDocument result = sessionRepository.findById(sessionDTO.getId()).orElseThrow();

        //SessionDTO로 변환하여 반환
        return DocumentConverter.toSessionDTO(result);
    }

    //특정 ID의 Project 데이터 가져오기
    public ProjectDTO getProjectById(ProjectDTO projectDTO)
    {
        //ProjectDocument로부터 ID로 데이터 가져오기
        ProjectDocument result = projectRepository.findById(projectDTO.getId()).orElseThrow();

        //ProjectDTO로 변환하여 반환
        return DocumentConverter.toProjectDTO(result);
    }

    public List<ApplicationSummaryDTO> getAllApplications() {
        List<ApplicationDocument> applicationDocuments = applicationRepository.findAll();
        return applicationDocuments.stream()
                .map(document -> {
                    ApplicationSummaryDTO dto = new ApplicationSummaryDTO();
                    dto.setId(document.getId());
                    dto.setTitle(document.getTitle());
                    dto.setStartTime(document.getStartTime());
                    dto.setEndTime(document.getEndTime());
                    return dto;
                })
                .collect(Collectors.toList());
    }

}
