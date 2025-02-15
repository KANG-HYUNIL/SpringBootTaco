package com.Kang.SpringBoot_Jpa.repository;

import com.Kang.SpringBoot_Jpa.entity.UserEntity;
import jakarta.annotation.Nonnull;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional; //Null을 반환할 수 있는 메소드의 반환 타입으로 사용

public interface UserRepository  extends JpaRepository<UserEntity, String> {

    //메서드 반환값이 null일 시에 Optional 객체로 치환되어서 나옴
    //따라서 메서드에 NonNull 어노테이션을 붙여줘야함
    @NonNull
    Optional<UserEntity> findById(@Nonnull String id); //id로 UserEntity를 찾는 메소드

    @Nonnull
    Optional<UserEntity> findByName(@Nonnull String name); //name으로 UserEntity를 찾는 메소드

    @Nonnull
    List<UserEntity> findByIdContaining(@Nonnull String id);

    @Nonnull
    List<UserEntity> findByNameContaining(@Nonnull String name);

    boolean existsByName(@Nonnull String name); //name으로 UserEntity가 존재하는지 확인하는 메소드

    boolean existsById(@Nonnull String id); //id로 UserEntity가 존재하는지 확인하는 메소드

    boolean existsByEmail(@Nonnull String email); //email로 UserEntity가 존재하는지 확인하는 메소드
}
