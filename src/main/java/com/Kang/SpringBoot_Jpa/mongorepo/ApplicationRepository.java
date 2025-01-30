package com.Kang.SpringBoot_Jpa.mongorepo;

import com.Kang.SpringBoot_Jpa.document.ApplicationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ApplicationRepository extends MongoRepository<ApplicationDocument, String> {
}
