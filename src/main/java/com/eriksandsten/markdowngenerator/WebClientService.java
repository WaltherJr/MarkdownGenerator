package com.eriksandsten.markdowngenerator;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.nio.file.Path;

@Service
public class WebClientService<T> {
    public <T> Mono<T> getExternalData(String url, ParameterizedTypeReference<T> responseType) {
        return WebClientConfig.defaultWebClientBuilder(WebClient.builder())
                .baseUrl(url)
                .build()
                .get()
                .retrieve()
                .bodyToMono(responseType);
    }

    public Mono<Void> streamFileDownload(String url, Path targetFilePath) {
        return WebClientConfig.defaultWebClientBuilder(WebClient.builder()).build().get()
                .uri(url)
                .accept(MediaType.APPLICATION_OCTET_STREAM)
                .retrieve()
                .bodyToFlux(DataBuffer.class)
                .as(data -> DataBufferUtils.write(data, targetFilePath));
    }
}
