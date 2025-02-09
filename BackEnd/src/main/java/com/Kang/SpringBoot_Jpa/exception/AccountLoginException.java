package com.Kang.SpringBoot_Jpa.exception;

public class AccountLoginException extends RuntimeException {
    public AccountLoginException(String message) {
        super(message);
    }
}
