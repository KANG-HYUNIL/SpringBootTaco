package com.Kang.SpringBoot_Jpa.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode
public class EmailRequestDTO {
    private String email;
    private String authCode;
}
