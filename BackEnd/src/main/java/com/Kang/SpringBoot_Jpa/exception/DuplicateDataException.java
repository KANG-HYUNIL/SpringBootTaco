package com.Kang.SpringBoot_Jpa.exception;

public class DuplicateDataException extends RuntimeException {
    public DuplicateDataException(String message) {
        super(message);
    }
}
