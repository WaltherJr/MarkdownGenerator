package com.eriksandsten.markdowngenerator;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GradleDetector {
    Map<String, Pattern> gradleSections = Map.of(
            "dependencies", Pattern.compile("dependencies\s*\\{(?<dependencies>.+)\\}", Pattern.DOTALL),
            "plugins", Pattern.compile("plugins\s*\\{(?<plugins>.+)\\}", Pattern.DOTALL)
    );

    public boolean hasGradleDependency(String buildGradleFile, String sectionName, String searchString) {
        return gradleSectionMatchesString(buildGradleFile, sectionName, searchString);
    }

    private boolean gradleSectionMatchesString(String buildGradleFile, String sectionName, String searchString) {
        try {
            String fileContent = Files.readString(Path.of(buildGradleFile));
            Matcher dependenciesSectionMatcher = gradleSections.get(sectionName).matcher(fileContent);

            if (dependenciesSectionMatcher.find()) {
                String matchedGroup = dependenciesSectionMatcher.group(sectionName);
                return matchedGroup.contains(searchString);
            }
        } catch (IOException e) {

        }

        return false;
    }

}
