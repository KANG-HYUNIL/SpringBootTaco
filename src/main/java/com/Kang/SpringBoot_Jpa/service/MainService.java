package com.Kang.SpringBoot_Jpa.service;

import com.Kang.SpringBoot_Jpa.Converter.DocumentConverter;
import com.Kang.SpringBoot_Jpa.document.ProjectDocument;
import com.Kang.SpringBoot_Jpa.document.SessionDocument;
import com.Kang.SpringBoot_Jpa.dto.ProjectDTO;
import com.Kang.SpringBoot_Jpa.dto.SessionDTO;
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



}
