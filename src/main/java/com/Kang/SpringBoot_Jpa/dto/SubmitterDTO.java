package com.Kang.SpringBoot_Jpa.dto;


import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SubmitterDTO {
    private String id;
    private String name;
    private String submittedFilePath;
}
