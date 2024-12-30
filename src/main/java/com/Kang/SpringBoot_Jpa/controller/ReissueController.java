package com.Kang.SpringBoot_Jpa.controller;

import com.Kang.SpringBoot_Jpa.service.ReissueService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@ResponseBody
public class ReissueController {

    //JWTUtil 의존성
    private final ReissueService reissueService;

    public ReissueController(ReissueService reissueService) {

        this.reissueService = reissueService;
    }


    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

        return reissueService.reissueRefreshToken(request, response);
    }



}
