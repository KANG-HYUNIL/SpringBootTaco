package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.dto.ProjectDTO;
import com.Kang.SpringBoot_Jpa.dto.SessionDTO;
import com.Kang.SpringBoot_Jpa.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


// /admin 경로로 오는 요청 처리 Controller
@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    //admin 페이지 넘겨주는 메소드
    @GetMapping("/")
    public String admin() {
        return "/admin/admin";
    }


    @GetMapping("/project")
    public String getProject()
    {
        //Project 데이터 가져오는 코드 필요

        return "/admin/adminProject";
    }

    @GetMapping("/session")
    public String getSession()
    {
        //Session 데이터 가져오는 코드 필요


        return "/admin/adminSession";
    }

    @GetMapping("/project/write")
    public  String getWriteProject()
    {

        return "/admin/adminWriteProject";
    }

    @GetMapping("/session/write")
    public  String getWriteSession()
    {
        return "/admin/adminWriteSession";
    }



    //본문 게시물 작성 요청 메서드



    //본문 게시물 수정 요청 메서드


    //Session 게시물 작성 요청 메서드
    @PostMapping("/writeSession")
    @ResponseBody
    public ResponseEntity<?> writeSession(@RequestBody SessionDTO sessionDTO)
    {

        adminService.writeSession(sessionDTO);

        return null;
    }

    //Session 게시물 수정 요청 메서드
    @PostMapping("/fixSession")
    @ResponseBody
    public ResponseEntity<?> fixSession(@RequestBody SessionDTO sessionDTO)
    {
        adminService.fixSession(sessionDTO);
        return null;
    }

    //Project 게시물 작성 요청 메서드
    @PostMapping("/writeProject")
    @ResponseBody
    public ResponseEntity<?> writeProject(@RequestBody ProjectDTO projectDTO)
    {
        adminService.writeProject(projectDTO);
        return null;
    }

    //Project 게시물 수정 요청 메서드
    @PostMapping("/fixProject")
    @ResponseBody
    public ResponseEntity<?> fixProject(@RequestBody ProjectDTO projectDTO)
    {
        adminService.fixProject(projectDTO);
        return null;
    }


}
