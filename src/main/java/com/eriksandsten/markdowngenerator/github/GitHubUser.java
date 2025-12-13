package com.eriksandsten.markdowngenerator.github;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GitHubUser {
    @JsonProperty(value = "login")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
