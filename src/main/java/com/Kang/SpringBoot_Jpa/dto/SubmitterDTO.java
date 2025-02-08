package com.Kang.SpringBoot_Jpa.dto;


import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SubmitterDTO {
    private String id;
    private String name;
    private List<String> submittedFilePaths;
}
