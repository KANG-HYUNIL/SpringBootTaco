package com.Kang.SpringBoot_Jpa.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationSummaryDTO {

    private String id;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;


}
