package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.dto.ProjectDTO;
import com.Kang.SpringBoot_Jpa.dto.SessionDTO;
import com.Kang.SpringBoot_Jpa.service.MainService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        Map<String, List<SessionDTO>> sessionData = mainService.getSessionGroupByTerm();
        model.addAttribute("sessionData", sessionData);
        return "main/session";
    }

    @GetMapping("/project")
    public String project(HttpServletRequest request, Model model) {
        String ipAddress = request.getRemoteAddr();
        log.info("Project page accessed by IP: {}", ipAddress);
        Map<String, List<ProjectDTO>> projectData = mainService.getProjectGroupByTerm();
        model.addAttribute("projectData", projectData);
        return "main/project";
    }

    @GetMapping("/faq")
    public String faq(HttpServletRequest request, Model model) {
        String ipAddress = request.getRemoteAddr();
        log.info("FAQ page accessed by IP: {}", ipAddress);
        return "main/faq";
    }


    //Application 페이지



//    @PostMapping("/save") //Post 요청 처리 메서드와 URL 매핑
//    public String save()
//    {
//        return "";
//    }
//
//    @RequestMapping("/board") //HTTP 메서드(4가지 모두) 요청 처리 메서드와 URL 매핑
//    public String board()
//    {
//        return "board";
//    }
//
//
//    @GetMapping("/board/{id}") //경로 변수를 사용한 URL 매핑
//    //PathVariable는 URL 경로에 변수를 넣어주는 것이다.
//    public String boardDetail(@PathVariable("id") int id)
//    {
//        return "boardDetail";
//    }

//    @GetMapping("/login") //Get 요청 처리 메서드와 URL 매핑
        //RequestParam은 URL에 있는 쿼리 스트링을 가져오는 것이다.
        //defaultValue는 값이 없을 때 기본값을 설정해주는 것이다.
        //required는 필수 여부를 설정해주는 것이다.
//    public String login(@RequestParam(defaultValue = "error", required = false) String error, @RequestParam(defaultValue = "logout", required = false) String logout) {
//        return "login";
//    }

}
