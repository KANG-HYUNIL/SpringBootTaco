package com.Kang.SpringBoot_Jpa.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
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
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;
    private String content;
    private List<String> attachmentFilePaths;
    private List<SubmitterDTO> submitters;

}
