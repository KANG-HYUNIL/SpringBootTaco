package com.Kang.SpringBoot_Jpa.exception;

public class SubmissionDeadlineException extends RuntimeException {
    public SubmissionDeadlineException(String message) {
        super(message);
    }
}