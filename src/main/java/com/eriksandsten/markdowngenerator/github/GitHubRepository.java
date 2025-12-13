package com.eriksandsten.markdowngenerator.github;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GitHubRepository {
    private String name;
    @JsonProperty(value = "full_name")
    private String fullName;
    @JsonProperty(value = "private")
    private Boolean isPrivate;
    @JsonProperty(value = "default_branch")
    private String defaultBranch;
    private GitHubUser owner;
    @JsonProperty(value = "html_url")
    private String htmlUrl;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Boolean getPrivate() {
        return isPrivate;
    }

    public void setPrivate(Boolean aPrivate) {
        isPrivate = aPrivate;
    }

    public String getDefaultBranch() {
        return defaultBranch;
    }

    public void setDefaultBranch(String defaultBranch) {
        this.defaultBranch = defaultBranch;
    }

    public GitHubUser getOwner() {
        return owner;
    }

    public void setOwner(GitHubUser owner) {
        this.owner = owner;
    }

    public String getHtmlUrl() {
        return htmlUrl;
    }

    public void setHtmlUrl(String htmlUrl) {
        this.htmlUrl = htmlUrl;
    }
}
