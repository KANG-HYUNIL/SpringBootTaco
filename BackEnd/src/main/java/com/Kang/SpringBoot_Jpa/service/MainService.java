package com.Kang.SpringBoot_Jpa.service;

import com.Kang.SpringBoot_Jpa.Converter.DocumentConverter;
import com.Kang.SpringBoot_Jpa.document.ApplicationDocument;
import com.Kang.SpringBoot_Jpa.document.ProjectDocument;
import com.Kang.SpringBoot_Jpa.document.SessionDocument;
import com.Kang.SpringBoot_Jpa.dto.*;
import com.Kang.SpringBoot_Jpa.entity.UserEntity;
import com.Kang.SpringBoot_Jpa.exception.NoDataException;
import com.Kang.SpringBoot_Jpa.exception.SubmissionDeadlineException;
import com.Kang.SpringBoot_Jpa.jwt.JwtUtil;
import com.Kang.SpringBoot_Jpa.mongorepo.ApplicationRepository;
import com.Kang.SpringBoot_Jpa.mongorepo.ProjectRepository;
import com.Kang.SpringBoot_Jpa.mongorepo.SessionRepository;
import jakarta.mail.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MainService {

    private final ProjectRepository projectRepository;
    private final SessionRepository sessionRepository;
    private final ApplicationRepository applicationRepository;
    private final JwtUtil jwtUtil;
    private final AccountService accountService;
    private final FileService fileService;


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

    //모든 application 게시물 데이터 획득
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

    //특정 게시물의 id를 토대로 해당 게시물의 모든 데이터 가져오기
    public ApplicationDTO getApplicationById(String id) {
        ApplicationDocument applicationDocument = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        return DocumentConverter.toApplicationDTO(applicationDocument);
    }

    //application 게시물에 제출하는 메서드
    public void submitApplication(String applicationId, String accessToken, SubmitterDTO submitterDTO) {

        //사용자 id와 이름
        String username;
        String name;

        //token을 통한 id 획득, id를 이용한 name 획득
        try {
            username = jwtUtil.getUsername(accessToken);
            UserEntity user = accountService.getUserByExactId(username);
            name = user.getName();
        }
        catch (Exception e)
        {
            log.error("Access token error: {}", e.getMessage());
            throw new NoDataException("Access token error");
        }

        //게시물 id의 유효성 검증
        ApplicationDocument applicationDocument = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));


        //제출 기한이 올바른지 검증 필요, 가져온 게시물에서 시작 및 종료 기간을 획득하고, 서버의 현재 시간과 비교해 처리(시간대 차이는 어떻게 하지?
        //통일된 시간대로 치환해서 비교 로직을 수행해야 할 듯. 그럼 더 나아가서 애초에 시간 데이터 표시가 시간대도 같이 표시하게끔
        // 제출 기한이 올바른지 검증 필요
        Date now = new Date();
        Date startTime = applicationDocument.getStartTime();
        Date endTime = applicationDocument.getEndTime();

        if (now.compareTo(startTime) < 0 || now.compareTo(endTime) > 0) {
            throw new SubmissionDeadlineException("Submission is not within the allowed time frame");
        }

        //게시물의 제출자 목록 처리 로직
        List<ApplicationDocument.Submitter> submitters = applicationDocument.getSubmitters();
        boolean submitterExists = false;

        //이미 제출한 기록이 있는지 검증
        for (ApplicationDocument.Submitter submitter : submitters)
        {
            //이미 제출한 기록이 있으면 제출한 파일 명만 교체
            if (submitter.getId().equals(username))
            {
                submitter.setSubmittedFilePaths(submitterDTO.getSubmittedFilePaths());
                submitterExists = true;
                break;
            }
        }

        //신규 제출 시 새로운 제출자 클래스 생성해 저장
        if (!submitterExists) {
            ApplicationDocument.Submitter newSubmitter = new ApplicationDocument.Submitter();
            newSubmitter.setId(username);
            newSubmitter.setName(name);
            newSubmitter.setSubmittedFilePaths(submitterDTO.getSubmittedFilePaths());
            submitters.add(newSubmitter);
        }

        for (String filePath : submitterDTO.getSubmittedFilePaths()) {
            fileService.fileRealUpload(filePath);
        }

        applicationRepository.save(applicationDocument);
        log.info("Successfully submitted application: id={}, submitter id={}", applicationId, username);
    }



}
