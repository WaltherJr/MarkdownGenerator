package com.eriksandsten.markdowngenerator.ui;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public final class MainToolbar {
    private static final List<List<ToolbarButton>> TOOLBAR_BUTTON_LAYOUT = List.of(
            List.of(
                    new ToolbarButton("format_quote", "blockquote"),
                    new ToolbarButton("horizontal_rule", null, false)
            ),
            List.of(
                    new ToolbarButton("format_bold", "strong"),
                    new ToolbarButton("format_italic", "i"),
                    new ToolbarButton("format_underlined", "u")
            ),
            IntStream.range(1, 7).mapToObj(i -> new ToolbarButton("format_h" + i, "h" + i)).toList()
    );

    public static List<List<ToolbarButton>> getToolbarLayout() {
        return TOOLBAR_BUTTON_LAYOUT;
    }

    public static class ToolbarButton {
        private final String caption;
        private final String htmlTagName;
        private final String className;
        private boolean canBeToggled = false;

        public ToolbarButton(String caption, String htmlTagName, boolean canBeToggled) {
            this.caption = caption;
            this.htmlTagName = htmlTagName;
            this.className = caption.replaceAll("_", "-");
            this.canBeToggled = canBeToggled;
        }

        public ToolbarButton(String caption, String htmlTagName) {
            this(caption, htmlTagName, true);
        }

        public String getCaption() {
            return caption;
        }

        public String getClassName() {
            return className;
        }

        public String getHtmlTagName() {
            return htmlTagName;
        }

        public boolean canBeToggled() {
            return canBeToggled;
        }
    }
}
