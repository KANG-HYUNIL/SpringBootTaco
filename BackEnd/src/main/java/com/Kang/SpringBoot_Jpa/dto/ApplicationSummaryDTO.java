package com.Kang.SpringBoot_Jpa.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Date;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationSummaryDTO {

    private String id;
    private String title;
    private Date startTime;
    private Date endTime;


}
