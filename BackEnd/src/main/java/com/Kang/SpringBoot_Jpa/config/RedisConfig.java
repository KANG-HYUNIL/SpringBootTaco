package com.Kang.SpringBoot_Jpa.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

//Redis 설정 클래스
@Configuration
@Getter
public class RedisConfig {

    //yml의 값들 가져오기
    @Value("${spring.redis.host}")
    private String host;

    @Value("${spring.redis.port}")
    private int port;

    @Value("${spring.mail.auth-code-expiration}")
    private long authCodeExpiration;

    //Bean에 RedisConnectionFactory 등록해 객체 관리
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {

        return new LettuceConnectionFactory(
                new RedisStandaloneConfiguration(host, port)
        );
    }

    //RedisTemplate 객체 생성 및 관리
    @Bean
    public RedisTemplate<?, ?> redisTemplate() {
        RedisTemplate<?, ?> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        return redisTemplate;
    }


}
