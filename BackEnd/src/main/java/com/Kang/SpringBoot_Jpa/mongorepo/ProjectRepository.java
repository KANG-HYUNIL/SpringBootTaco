package com.Kang.SpringBoot_Jpa.mongorepo;

import com.Kang.SpringBoot_Jpa.document.ProjectDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<ProjectDocument, String> {
}
