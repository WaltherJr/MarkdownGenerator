package com.eriksandsten.markdowngenerator.controller;

import com.eriksandsten.markdowngenerator.GradleDetector;
import com.eriksandsten.markdowngenerator.Helper;
import com.eriksandsten.markdowngenerator.NodeProcess;
import com.eriksandsten.markdowngenerator.detectors.FileDetector;
import com.eriksandsten.markdowngenerator.detectors.FileTypeDetector;
import com.eriksandsten.markdowngenerator.detectors.JQueryDetector;
import com.eriksandsten.markdowngenerator.github.GitHubService;
import com.eriksandsten.markdowngenerator.ui.LinkPanel;
import com.eriksandsten.markdowngenerator.ui.MoveElementPanel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Controller
public class MainController {
    @Value("${defaultMarkdownFooterText}")
    private String defaultMarkdownFooterText;

    private final GradleDetector gradleDetector;

    @Autowired
    public MainController(GradleDetector gradleDetector, GitHubService gitHubService) {
        this.gradleDetector = gradleDetector;
    }

    Map<Pattern, Supplier<String>> expressionExpansions = Map.of(
        Pattern.compile("!currentYear!"), () -> String.valueOf(LocalDate.now().getYear())
    );

    @GetMapping("/")
    public String main(Model model) {
        final String markdownFooterText = expandVariables(defaultMarkdownFooterText);
        model.addAttribute("defaultMarkdownFooterText", markdownFooterText);
        String s = new NodeProcess().getMarkdownSections();
        List<Path> projectJavaFiles;

        boolean hasSpringBootDependency = gradleDetector.hasGradleDependency("build.gradle", "plugins", "'org.springframework.boot'"); // Important with the "'"
        boolean hasThymeleafDependency = gradleDetector.hasGradleDependency("build.gradle", "dependencies", "spring-boot-starter-thymeleaf");
        boolean hasSpringValidationDependency = gradleDetector.hasGradleDependency("build.gradle", "dependencies", "spring-boot-starter-validation");
        boolean hasJQueryDependency = new JQueryDetector().hasDependency();
        boolean hasJavaScriptDependency = FileTypeDetector.hasDependency("src", ".js"); // TODO: Search for <script> tags in HTML as well (and other file endings)
        boolean hasCAndCppDependency = FileTypeDetector.hasDependency("src", List.of(".c", ".cpp", ".h")); // TODO: Search for <script> tags in HTML as well
        boolean hasSassDependency = FileTypeDetector.hasDependency("src", ".scss");
        boolean hasCSSDependency = hasSassDependency || FileTypeDetector.hasDependency("src", ".css");
        boolean hasHTMLDependency = hasThymeleafDependency || FileTypeDetector.hasDependency("src", ".html");
        boolean hasGradleDependency = FileDetector.fileExists("build.gradle");
        boolean hasMavenDependency = FileDetector.fileExists("pom.xml");
        boolean hasNodeJSDependency = FileDetector.fileExists("package.json");

        try {
            projectJavaFiles = Helper.getFilesWithFileEnding("src", ".java");
            model.addAttribute("projectJavaFiles", projectJavaFiles);
        } catch (IOException e) {

        }

        model.addAttribute("s", s);
        model.addAttribute("panels", Map.of(
                "linkPanel", Map.of("panelIcons", LinkPanel.uiIcons),
                "moveElementPanel", Map.of("panelIcons", MoveElementPanel.uiIcons))
        );

        return "main";
    }

    private String expandVariables(String expression) {
        String expandedString = expression;

        for (var entry : expressionExpansions.entrySet()) {
            Matcher m = entry.getKey().matcher(expandedString);

            if (m.find()) {
                expandedString = m.replaceAll(entry.getValue().get());
            }
        }

        return expandedString;
    }
}
