package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.dto.*;
import com.Kang.SpringBoot_Jpa.service.MainService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MainController {

    //MainService 객체 주입
    private final MainService mainService;



//    @GetMapping("/")
//    public String index(HttpServletRequest request) {
//        String ipAddress = request.getRemoteAddr();
//        log.info("Index page accessed by IP: {}", ipAddress);
//        return "index";
//    }
//
//    @GetMapping("/about")
//    public String about(HttpServletRequest request) {
//        String ipAddress = request.getRemoteAddr();
//        log.info("About page accessed by IP: {}", ipAddress);
//        return "main/about";
//    }
//
//    @GetMapping("/session")
//    public String session(HttpServletRequest request, Model model) {
//        String ipAddress = request.getRemoteAddr();
//        log.info("Session page accessed by IP: {}", ipAddress);
//
//        return "main/session";
//    }



    //프로젝트 데이터 전체 반환
    @GetMapping("/getProjectData")
    @ResponseBody
    public Map<String, List<ProjectDTO>> getProjectData() {
        return mainService.getProjectGroupByTerm();
    }

    //세션 데이터 전체 반환
    @GetMapping("/getSessionData")
    @ResponseBody
    public Map<String, List<SessionDTO>> getSessionData() {
        return mainService.getSessionGroupByTerm();
    }

    //개별 Project 데이터 반환
    @PostMapping("/getProjectById")
    @ResponseBody
    public ResponseEntity<ProjectDTO> getProjectById(@RequestBody ProjectDTO projectDTO) {
        ProjectDTO project = mainService.getProjectById(projectDTO);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    //개별 Session 데이터 반환
    @PostMapping("/getSessionById")
    @ResponseBody
    public ResponseEntity<SessionDTO> getSessionById(@RequestBody SessionDTO sessionDTO) {
        SessionDTO session = mainService.getSessionById(sessionDTO);
        return new ResponseEntity<>(session, HttpStatus.OK);
    }


//    @GetMapping("/project")
//    public String project(HttpServletRequest request, Model model) {
//        String ipAddress = request.getRemoteAddr();
//        log.info("Project page accessed by IP: {}", ipAddress);
//        return "main/project";
//    }
//
//    @GetMapping("/faq")
//    public String faq(HttpServletRequest request, Model model) {
//        String ipAddress = request.getRemoteAddr();
//        log.info("FAQ page accessed by IP: {}", ipAddress);
//        return "main/faq";
//    }
//
//
//    //Application 페이지
//    @GetMapping("/application")
//    public String application(HttpServletRequest request, Model model) {
//        String ipAddress = request.getRemoteAddr();
//        log.info("Application page accessed by IP: {}", ipAddress);
//        return "main/application";
//    }

    //Application 전체 데이터 반환
    @GetMapping("/getApplicationData")
    @ResponseBody
    public ResponseEntity<List<ApplicationSummaryDTO>> getApplicationData() {
        List<ApplicationSummaryDTO> applications = mainService.getAllApplications();
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

//    //Application 게시물 본문 요청 메서드
//    @GetMapping("/application/content")
//    public String getApplicationSubmit(@RequestParam("id") String id, HttpServletRequest request) {
//        String ipAddress = request.getRemoteAddr();
//        log.info("Application Content page ID: {} accessed by IP: {}", id, ipAddress);
//        return "main/applicationSubmit";
//    }

    //개별 Application 데이터 반환
    @PostMapping("/getApplicationById")
    @ResponseBody
    public ResponseEntity<ApplicationDTO> getApplicationById(@RequestParam String id) {
        ApplicationDTO application = mainService.getApplicationById(id);
        return new ResponseEntity<>(application, HttpStatus.OK);
    }

    //Application 게시물 제출 메서드
    @PostMapping("/application/submit")
    @ResponseBody
    public ResponseEntity<?> submitApplication(
            @RequestParam("id") String applicationId,
            @RequestHeader("access") String accessToken,
            @RequestBody SubmitterDTO submitterDTO) {

        mainService.submitApplication(applicationId, accessToken, submitterDTO);
        return new ResponseEntity<>("Application submission complete", HttpStatus.OK);
    }

}
