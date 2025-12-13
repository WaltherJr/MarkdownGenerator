package com.eriksandsten.markdowngenerator;

import com.fasterxml.jackson.databind.json.JsonMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    public static WebClient.Builder defaultWebClientBuilder(WebClient.Builder webClientBuilder) {
        return webClientBuilder.codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(16 * 1024 * 1024));
    }

    @Bean
    public JsonMapper jsonMapper() {
        return JsonMapper.builder().build();
    }
}

