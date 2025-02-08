package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.dto.*;
import com.Kang.SpringBoot_Jpa.exception.DuplicateDataException;
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

    @GetMapping("/application/write")
    public String getWriteApplication(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("Admin write application page accessed by IP: {}", ipAddress);
        return "/admin/adminWriteApplication";
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

    @GetMapping("/application/fix")
    public String getFixApplication(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("Admin fix application page accessed by IP: {}", ipAddress);
        return "/admin/adminWriteApplication";
    }

    @GetMapping("/application/content")
    public String getAdminApplicationSubmit(@RequestParam("id") String id, HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("Admin Application Content page ID: {} accessed by IP: {}", id, ipAddress);
        return "/admin/adminApplicationSubmit";
    }


    //본문 게시물 수정 요청 메서드


    //Session 게시물 작성 요청 메서드
    @PostMapping("/writeSession")
    @ResponseBody
    public ResponseEntity<?> writeSession(@RequestBody SessionDTO sessionDTO, HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        adminService.writeSession(sessionDTO, accessToken);
        return new ResponseEntity<>("Session Upload Complete", HttpStatus.OK);
    }

    @PostMapping("/fixSession")
    @ResponseBody
    public ResponseEntity<?> fixSession(@RequestBody SessionDTO sessionDTO, HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        adminService.fixSession(sessionDTO, accessToken);
        return new ResponseEntity<>("Session Fix Complete", HttpStatus.OK);
    }

    @PostMapping("/deleteSession")
    @ResponseBody
    public ResponseEntity<?> deleteSession(@RequestBody SessionDTO sessionDTO, HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        adminService.deleteSession(sessionDTO, accessToken);
        return new ResponseEntity<>("Session Delete Complete", HttpStatus.OK);
    }

    @PostMapping("/writeProject")
    @ResponseBody
    public ResponseEntity<?> writeProject(@RequestBody ProjectDTO projectDTO, HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        adminService.writeProject(projectDTO, accessToken);
        return new ResponseEntity<>("Project Upload Complete", HttpStatus.OK);
    }

    @PostMapping("/fixProject")
    @ResponseBody
    public ResponseEntity<?> fixProject(@RequestBody ProjectDTO projectDTO, HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        adminService.fixProject(projectDTO, accessToken);
        return new ResponseEntity<>("Project Fix Complete", HttpStatus.OK);
    }

    @PostMapping("/deleteProject")
    @ResponseBody
    public ResponseEntity<?> deleteProject(@RequestBody ProjectDTO projectDTO, HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        adminService.deleteProject(projectDTO, accessToken);
        return new ResponseEntity<>("Project Delete Complete", HttpStatus.OK);
    }

    @PostMapping("/setRoleUser")
    @ResponseBody
    public ResponseEntity<?> setRoleUser(@RequestBody UserDTO userDTO, HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        try {
            adminService.setRoleUser(userDTO, accessToken);
            return new ResponseEntity<>("Role set to ROLE_USER", HttpStatus.OK);
        } catch (DuplicateDataException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/setRoleAdmin")
    @ResponseBody
    public ResponseEntity<?> setRoleAdmin(@RequestBody UserDTO userDTO, HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        try {
            adminService.setRoleAdmin(userDTO, accessToken);
            return new ResponseEntity<>("Role set to ROLE_ADMIN", HttpStatus.OK);
        } catch (DuplicateDataException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/writeApplication")
    @ResponseBody
    public ResponseEntity<?> writeApplication(@RequestBody ApplicationDTO applicationDTO, HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        adminService.writeApplication(applicationDTO, accessToken);
        return new ResponseEntity<>("Application Upload Complete", HttpStatus.OK);
    }

    @PostMapping("/deleteApplication")
    @ResponseBody
    public ResponseEntity<?> deleteApplication(@RequestBody ApplicationDTO applicationDTO, HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        adminService.deleteApplication(applicationDTO, accessToken);
        return new ResponseEntity<>("Application Delete Complete", HttpStatus.OK);
    }

    @PostMapping("/fixApplication")
    @ResponseBody
    public ResponseEntity<?> fixApplication(@RequestBody ApplicationDTO applicationDTO, HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        //fixme
        adminService.deleteApplication(applicationDTO, accessToken);
        return new ResponseEntity<>("Application Fix Complete", HttpStatus.OK);
    }


}
