package com.Kang.SpringBoot_Jpa.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

//모든 예외를 처리하는 핸들러
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    //여기에 작성되지 않은 모든 Exception을 처리하는 핸들러
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception e, WebRequest request)
    {
        log.error("An unexpected error occurred: {}", e.getMessage());
        return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //유효하지 않은 인증번호 예외 처리
    @ExceptionHandler(InvalidAuthCodeException.class)
    public ResponseEntity<?> handleInvalidAuthCodeException(InvalidAuthCodeException e, WebRequest request) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    //데이터 입력 양식(id에 특수문자 등) 예외 처리
    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<?> handleInvalidInputException(InvalidInputException e, WebRequest request) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    //데이터 중복 예외 처리
    @ExceptionHandler(DuplicateDataException.class)
    public ResponseEntity<?> handleDuplicateIdException(DuplicateDataException e, WebRequest request) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
    }

    //데이터 없음 예외 처리
    @ExceptionHandler(NoDataException.class)
    public ResponseEntity<?> handleNoDataException(NoDataException e, WebRequest request) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SubmissionDeadlineException.class)
    public ResponseEntity<?> handleSubmissionDeadlineException(SubmissionDeadlineException e, WebRequest request) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
