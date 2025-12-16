package com.eriksandsten.markdowngenerator.utils;

import java.util.Arrays;
import java.util.List;

public final class CSSListStyles {
    public static List<String> LIST_STYLE_TYPES = Arrays.asList(
            "none",
            "disc", "circle", "square",
            "decimal", "decimal-leading-zero",
            "lower-alpha", "upper-alpha",
            "lower-latin", "upper-latin",
            "lower-roman", "upper-roman",
            "lower-greek", "armenian", "georgian", "hebrew",
            "cjk-ideographic",
            "hiragana", "hiragana-iroha",
            "katakana", "katakana-iroha"
    );
}
