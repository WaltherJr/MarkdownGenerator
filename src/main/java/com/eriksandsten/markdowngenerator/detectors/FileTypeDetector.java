package com.eriksandsten.markdowngenerator.detectors;

import com.eriksandsten.markdowngenerator.Helper;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

public class FileTypeDetector {
    public static boolean hasDependency(String rootDirectory, String fileEndings) {
        try {
            List<Path> filesWithFileEnding = Helper.getFilesWithFileEnding(rootDirectory, fileEndings);
            return !filesWithFileEnding.isEmpty();

        } catch (IOException e) {
            return false;
        }
    }

    public static boolean hasDependency(String rootDirectory, List<String> fileEndings) {
        if (fileEndings == null || fileEndings.isEmpty()) {
            throw new IllegalArgumentException("fileEndings needs to be non-empty");
        } else {
            Map<String, List<Path>> filesWithFileEnding = Helper.getFilesWithFileEnding(rootDirectory, fileEndings);
            return !filesWithFileEnding.values().stream().allMatch(List::isEmpty);
        }
    }
}
