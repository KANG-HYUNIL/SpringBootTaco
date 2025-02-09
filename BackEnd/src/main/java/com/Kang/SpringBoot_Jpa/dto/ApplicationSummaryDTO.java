package com.Kang.SpringBoot_Jpa.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationSummaryDTO {

    private String id;
    private String title;
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;


}
