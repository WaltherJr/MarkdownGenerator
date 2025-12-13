package com.eriksandsten.markdowngenerator.utils;

import com.eriksandsten.markdowngenerator.ui.MaterialIcons;
import org.springframework.stereotype.Component;

@Component
public class ThymeleafHelper {
    public String getAppIconsList() {
        return MaterialIcons.getAppIconsList();
    }
}
