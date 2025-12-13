package com.eriksandsten.markdowngenerator;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class Helper {
    private static final Pattern htmlElementAttributesPattern = Pattern.compile("\\s*(?<attributeName>.+?)=\\s*\"(?<attributeValue>.+?)\"", Pattern.DOTALL);

    public static List<Path> getFilesWithFileEnding(String directory, String fileEnding) throws IOException {
        Path root = Paths.get(directory);

        PathMatcher matcher = FileSystems.getDefault().getPathMatcher("glob:**/*" + fileEnding);

        try (var paths = Files.walk(root)) {
            List<Path> files = paths.filter(Files::isRegularFile).filter(matcher::matches).toList();
            return files;
        }
    }

    public static Map<String, List<Path>> getFilesWithFileEnding(String directory, List<String> fileEndings) {
        Path root = Paths.get(directory);

        return fileEndings.stream().collect(Collectors.toMap(fileEnding -> fileEnding,fileEnding -> {
            try {
                PathMatcher matcher = FileSystems.getDefault().getPathMatcher("glob:**/*" + fileEnding);

                try (var paths = Files.walk(root)) {
                    List<Path> files = paths.filter(Files::isRegularFile).filter(matcher::matches).toList();
                    return files;
                }
            } catch (IOException e) {
                return null;
            }
        }));
    }

    public static Map<String, String> getHtmlAttributesFromElementHtml(String elementHtml) {
        Matcher m = htmlElementAttributesPattern.matcher(elementHtml);
        Map<String, String> a = new HashMap<>();

        while (m.find()) {
            a.put(m.group("attributeName"), m.group("attributeValue"));
        }

        return a.isEmpty() ? null : a;
    }
}
