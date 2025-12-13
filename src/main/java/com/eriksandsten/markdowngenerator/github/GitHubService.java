package com.eriksandsten.markdowngenerator.github;

import com.eriksandsten.markdowngenerator.WebClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;

@Service
public class GitHubService {
    private WebClientService<List<GitHubRepository>> webClientService;

    @Autowired
    public GitHubService(WebClientService<List<GitHubRepository>> webClientService) {
        this.webClientService = webClientService;
    }

    public List<GitHubRepository> getUserGithubRepositories(String userName) {
        List<GitHubRepository> userRepos = webClientService.getExternalData("https://api.github.com/users/%s/repos".formatted(userName),
                new ParameterizedTypeReference<List<GitHubRepository>>(){}).block();

        return userRepos;
    }

    public void fetchGithubRepoZipFile(String repositoryFullName, String defaultBranchName) {
        try {
            final String filePrefix = repositoryFullName.toLowerCase().replaceAll("/", "-") + "-";
            Path tempZipFile = Files.createTempFile(filePrefix, ".zip");
            webClientService.streamFileDownload("https://github.com/%s/archive/refs/heads/%s.zip".formatted(repositoryFullName, defaultBranchName), tempZipFile);
            Files.createTempDirectory(filePrefix + "-dir");

            // TODO: Unzip the zip file
            return;
        } catch (IOException e) {
            return;
        }
    }
}
