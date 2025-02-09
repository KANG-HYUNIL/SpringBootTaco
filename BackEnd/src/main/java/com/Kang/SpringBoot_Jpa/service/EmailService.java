package com.Kang.SpringBoot_Jpa.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@Slf4j
public class EmailService {


    //JavaMailSender 객체 의존성 주입, 이는 EmailConfig에서 Bean을 통해 생성된 객체
    private final JavaMailSender javaMailSender;

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    //이메일 전송 메소드
    public void sendEmail(String toEmail, String title, String text)
    {
        SimpleMailMessage emailForm = createEmailForm(toEmail, title, text); //발신할 이메일 데이터 세팅

        try
        {
            //JavaMailSender 객체를 통해 이메일 발신
            javaMailSender.send(emailForm);

        } catch (RuntimeException e) {

            log.error("Error sending email to {}: {}", toEmail, e.getMessage(), e);
            //RuntimeException 발생 시 예외 처리
            //fixme
            throw new RuntimeException(e);
        }

    }

    // 발신할 이메일 데이터 세팅
    private SimpleMailMessage createEmailForm(String toEmail,
                                              String title,
                                              String text)
    {
        //SimpleMailMessage 객체 생성 및 멤버 설정
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(title);
        message.setText(text);
        //SimpleMailMessage 객체 반환
        return message;
    }

}
