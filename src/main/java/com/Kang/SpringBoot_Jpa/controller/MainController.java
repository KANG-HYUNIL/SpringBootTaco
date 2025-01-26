package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.dto.ProjectDTO;
import com.Kang.SpringBoot_Jpa.dto.SessionDTO;
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



    @GetMapping("/")
    public String index(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("Index page accessed by IP: {}", ipAddress);
        return "index";
    }

    @GetMapping("/about")
    public String about(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("About page accessed by IP: {}", ipAddress);
        return "main/about";
    }

    @GetMapping("/session")
    public String session(HttpServletRequest request, Model model) {
        String ipAddress = request.getRemoteAddr();
        log.info("Session page accessed by IP: {}", ipAddress);

        return "main/session";
    }

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

    @GetMapping("/getProjectById")
    @ResponseBody
    public ResponseEntity<ProjectDTO> getProjectById(ProjectDTO projectDTO) {
        ProjectDTO project = mainService.getProjectById(projectDTO);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @GetMapping("/getSessionById")
    @ResponseBody
    public ResponseEntity<SessionDTO> getSessionById(SessionDTO sessionDTO) {
        SessionDTO session = mainService.getSessionById(sessionDTO);
        return new ResponseEntity<>(session, HttpStatus.OK);
    }


    @GetMapping("/project")
    public String project(HttpServletRequest request, Model model) {
        String ipAddress = request.getRemoteAddr();
        log.info("Project page accessed by IP: {}", ipAddress);
        return "main/project";
    }

    @GetMapping("/faq")
    public String faq(HttpServletRequest request, Model model) {
        String ipAddress = request.getRemoteAddr();
        log.info("FAQ page accessed by IP: {}", ipAddress);
        return "main/faq";
    }


    //Application 페이지




}
