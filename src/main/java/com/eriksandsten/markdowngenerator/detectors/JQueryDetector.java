package com.eriksandsten.markdowngenerator.detectors;

import com.eriksandsten.markdowngenerator.Helper;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;
import java.util.regex.MatchResult;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JQueryDetector implements DependencyDetector {
    final Pattern scriptPattern = Pattern.compile("<script(?<scriptAttributes>[^>]+)>", Pattern.DOTALL);

    @Override
    public boolean hasDependency() {
        try {
            var projectHtmlFiles = Helper.getFilesWithFileEnding("src", ".html");

            long count = projectHtmlFiles.stream().map(file -> {
                try {
                    String fileContent = Files.readString(file);
                    Matcher m = scriptPattern.matcher(fileContent);

                    if (m.find()) {
                        return m.results().anyMatch(this::hasJQuerySrcAttribute);
                    }
                } catch (IOException e) {
                    throw new RuntimeException(e.getCause());
                }

                return false;
            }).filter(hasJQuerySrcAttribute -> hasJQuerySrcAttribute).count();

            return count > 0;
        } catch (IOException e) {
            throw new RuntimeException(e.getCause());
        }
    }

    public boolean hasJQuerySrcAttribute(MatchResult result) {
        String scriptAttributesHtml = result.group("scriptAttributes");
        Map<String, String> scriptAttributes = Helper.getHtmlAttributesFromElementHtml(scriptAttributesHtml);

        return scriptAttributes != null && scriptAttributes.containsKey("src") && scriptAttributes.get("src").contains("jquery");
    }
}
