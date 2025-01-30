package com.Kang.SpringBoot_Jpa.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ApplicationDTO {

    private String id;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String content;
    private List<String> attachmentFilePaths;
    private List<SubmitterDTO> submitters;

}
