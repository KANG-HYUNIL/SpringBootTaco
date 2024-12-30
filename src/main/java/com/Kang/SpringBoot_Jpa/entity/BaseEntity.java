package com.Kang.SpringBoot_Jpa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass //Entity 클래스가 해당 클래스를 상속받은 경우, 해당 클래스의 변수들도 Column으로 인식

//JPA의 생명주기 이벤트(생성 전 및 후, 수정 전 및 후, 읽기 전 및 후 등)가 발생 시 이벤트를 감지해
//특정 동작을 수행하게끔 하는 EntityListeners
//JPA 에서 제공하는 AuditingEntityListener 를 통해 Entity 객체 내의 @CreatoinTimestamp, @UpdateTimestamp 어노테이션을 감지,
//해당 어노테이션이 붙은 필드에 자동으로 시간 정보를 저장 및 갱신할 수 있게끔 도와준다
@EntityListeners(AuditingEntityListener.class)
@Getter
//시간 정보를 따로 다루는 Entity 클래스 처리 가능
//이 클래스를 상속받는 Entity 클래스는 자동으로 생성 시간, 수정 시간을 관리 가능
public class BaseEntity {

    @CreationTimestamp //생성 시간 자동 생성
    @Column(updatable = false) //수정 관여 불가
    private LocalDateTime createdTime;

    @UpdateTimestamp //수정 시간 자동 생성
    @Column(insertable = false) //삽입 관여 불가
    private LocalDateTime updatedTime;

}
