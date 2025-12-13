package com.eriksandsten.markdowngenerator.detectors;

import java.nio.file.Paths;

public class FileDetector {
    public static boolean fileExists(String fileName) {
        return Paths.get(fileName).toFile().exists();
    }
}
