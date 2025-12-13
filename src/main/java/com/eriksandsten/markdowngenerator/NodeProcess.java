package com.eriksandsten.markdowngenerator;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class NodeProcess {
    public String getMarkdownSections() {
        ProcessBuilder pb = new ProcessBuilder("node", "generate_markdown_sections.mjs");

        // pb.directory(new File("/path/to/project"));
        pb.redirectErrorStream(true);

        try {
            Process process = pb.start();
            StringBuilder sb = new StringBuilder();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line + "\n");
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            int exitCode = process.waitFor();
            return sb.toString();

        } catch (IOException | InterruptedException e) {
            return null;
        }
    }
}
