package com.Kang.SpringBoot_Jpa.utils;

import java.util.regex.Pattern;

public class InputValidator {

    private static final String INVALID_CHARACTERS = ".*[\\s'\";\\-].*";
    private static final String PASSWORD_VALID_CHARACTERS = "^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]*$";

    //id 유효성 검증
    //유효한 id면 true, 아니면 false
    public static boolean isValid(String input) {
        return !Pattern.matches(INVALID_CHARACTERS, input);
    }

    //password 유효성 검증
    //유효한 password면 true, 아니면 false
    public static boolean isPasswordValid(String password) {
        return Pattern.matches(PASSWORD_VALID_CHARACTERS, password);
    }
}
