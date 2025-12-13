package com.eriksandsten.markdowngenerator.controller;

import com.eriksandsten.markdowngenerator.github.GitHubRepository;
import com.eriksandsten.markdowngenerator.github.GitHubService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GitHubController {
    private final GitHubService gitHubService;

    public GitHubController(GitHubService gitHubService) {
        this.gitHubService = gitHubService;
    }

    @GetMapping(value = "/github-repos")
    public List<GitHubRepository> getUserGithubRepositories(@RequestParam String username) {
        return gitHubService.getUserGithubRepositories(username);
    }

    @GetMapping(value = "/github-repo-inspect")
    public void inspectGithubRepo(@RequestParam String repositoryFullName, @RequestParam String defaultBranchName) {
        gitHubService.fetchGithubRepoZipFile(repositoryFullName, defaultBranchName);
    }
}
