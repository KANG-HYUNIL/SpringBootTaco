package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.dto.DisplayedFileDTO;
import com.Kang.SpringBoot_Jpa.dto.ProjectDTO;
import com.Kang.SpringBoot_Jpa.dto.SessionDTO;
import com.Kang.SpringBoot_Jpa.service.AdminService;
import com.Kang.SpringBoot_Jpa.service.MainService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


// /admin 경로로 오는 요청 처리 Controller
@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;


    //admin 페이지 넘겨주는 메소드
    @GetMapping("/")
    public String admin(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("Admin page accessed by IP: {}", ipAddress);
        return "/admin/admin";
    }

    @GetMapping("/project")
    public String getProject(HttpServletRequest request, Model model) {
        String ipAddress = request.getRemoteAddr();
        log.info("Admin project page accessed by IP: {}", ipAddress);

        return "/admin/adminProject";
    }

    @GetMapping("/session")
    public String getSession(HttpServletRequest request, Model model) {
        String ipAddress = request.getRemoteAddr();
        log.info("Admin session page accessed by IP: {}", ipAddress);

        return "/admin/adminSession";
    }

    @GetMapping("/project/write")
    public String getWriteProject(HttpServletRequest request, Model model) {
        String ipAddress = request.getRemoteAddr();
        log.info("Admin write project page accessed by IP: {}", ipAddress);
        return "/admin/adminWriteProject";
    }

    @GetMapping("/session/write")
    public String getWriteSession(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("Admin write session page accessed by IP: {}", ipAddress);
        return "/admin/adminWriteSession";
    }

    @GetMapping("/session/fix")
    public String getFixSession(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("Admin fix session page accessed by IP: {}", ipAddress);
        return "/admin/adminWriteSession";
    }

    @GetMapping("/project/fix")
    public String getFixProject(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("Admin fix project page accessed by IP: {}", ipAddress);
        return "/admin/adminWriteProject";
    }


    //본문 게시물 수정 요청 메서드


    //Session 게시물 작성 요청 메서드
    @PostMapping("/writeSession")
    @ResponseBody
    public ResponseEntity<?> writeSession(@RequestBody SessionDTO sessionDTO) {

        adminService.writeSession(sessionDTO);

        return new ResponseEntity<>("Session Upload Complete", HttpStatus.OK);
    }

    //Session 게시물 수정 요청 메서드
    @PostMapping("/fixSession")
    @ResponseBody
    public ResponseEntity<?> fixSession(@RequestBody SessionDTO sessionDTO) {
        adminService.fixSession(sessionDTO);
        return new ResponseEntity<>("Session Fix Complete", HttpStatus.OK);
    }

    //Session 게시물 삭제 요청 메서드
    @PostMapping("/deleteSession")
    @ResponseBody
    public ResponseEntity<?> deleteSession(@RequestBody SessionDTO sessionDTO)
    {
        adminService.deleteSession(sessionDTO);
        return new ResponseEntity<>("Session Delete Complete", HttpStatus.OK);
    }

    //Project 게시물 작성 요청 메서드
    @PostMapping("/writeProject")
    @ResponseBody
    public ResponseEntity<?> writeProject(@RequestBody ProjectDTO projectDTO)
    {
        adminService.writeProject(projectDTO);
        return new ResponseEntity<>("Project Upload Complete", HttpStatus.OK);
    }

    //Project 게시물 수정 요청 메서드
    @PostMapping("/fixProject")
    @ResponseBody
    public ResponseEntity<?> fixProject(@RequestBody ProjectDTO projectDTO)
    {
        adminService.fixProject(projectDTO);
        return new ResponseEntity<>("Project Fix Complete", HttpStatus.OK);
    }

    //Project 게시물 삭제 요청 메서드
    @PostMapping("/deleteProject")
    @ResponseBody
    public ResponseEntity<?> deleteProject(@RequestBody ProjectDTO projectDTO)
    {
        adminService.deleteProject(projectDTO);
        return new ResponseEntity<>("Project Delete Complete", HttpStatus.OK);
    }


}
