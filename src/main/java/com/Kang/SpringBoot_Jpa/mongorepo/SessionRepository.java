package com.Kang.SpringBoot_Jpa.mongorepo;

import com.Kang.SpringBoot_Jpa.document.SessionDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SessionRepository extends MongoRepository<SessionDocument, String> {
}
