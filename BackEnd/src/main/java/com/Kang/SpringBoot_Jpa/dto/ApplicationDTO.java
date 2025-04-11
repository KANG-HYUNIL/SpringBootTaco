package com.Kang.SpringBoot_Jpa.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Date;
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
    private Date startTime;
    private Date endTime;
    private String content;
    private List<String> attachmentFilePaths;
    private List<SubmitterDTO> submitters;

}
