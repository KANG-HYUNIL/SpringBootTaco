package com.Kang.SpringBoot_Jpa.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

@Document(collection = "applicationData")
@Data
public class ApplicationDocument {

    @Id
    private String id;
    private String title;
    private Date startTime;
    private Date endTime;
    private String content;
    private List<String> attachmentFilePaths;
    private List<Submitter> submitters;

    @Data
    public static class Submitter {
        private String id;
        private String name;
        private List<String> submittedFilePaths;
    }

}
