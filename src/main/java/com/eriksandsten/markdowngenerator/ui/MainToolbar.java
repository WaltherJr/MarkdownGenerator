package com.eriksandsten.markdowngenerator.ui;

import com.eriksandsten.markdowngenerator.utils.I18NHelper;
import java.util.List;
import java.util.stream.IntStream;

public final class MainToolbar {
    private static final List<List<ToolbarButton>> TOOLBAR_BUTTON_LAYOUT = List.of(
            List.of(
                    new ToolbarButton("format_quote", I18NHelper.buildCapitalizedString("insert", "blockquote"),"blockquote"),
                    new ToolbarButton("horizontal_rule", I18NHelper.buildCapitalizedString("insert", "horizontal_rule"), "hr", false),
                    new ToolbarButton("code_blocks", I18NHelper.buildCapitalizedStringWithoutDelimiter("insert", " ", "code", " [locale=en-US]", "block"), "pre"),
                    new ToolbarButton("image", I18NHelper.buildCapitalizedString("insert", "image"), "image"),
                    new ToolbarButton("table", I18NHelper.buildCapitalizedString("insert", "table"), "table"),
                    new ToolbarButton("format_list_bulleted", I18NHelper.buildCapitalizedString("insert", "unordered", "list"), "ul"),
                    new ToolbarButton("format_list_numbered", I18NHelper.buildCapitalizedString("insert", "ordered", "list"), "ol")),
            List.of(
                    new ToolbarButton("format_bold", I18NHelper.buildCapitalizedString("make", "text", "bold"), "strong"),
                    new ToolbarButton("format_italic", I18NHelper.buildCapitalizedString("make", "text", "italic"), "i"),
                    new ToolbarButton("format_underlined", I18NHelper.buildCapitalizedString("make", "text", "underlined"), "u"),
                    new ToolbarButton("strikethrough_s", I18NHelper.buildCapitalizedString("make", "text", "striked"), "s"),
                    new ToolbarButton("code", I18NHelper.buildCapitalizedString("make", "text", "to", "code"), "code")
            ),
            IntStream.range(1, 7).mapToObj(i -> new ToolbarButton("format_h" + i,
                    I18NHelper.buildCapitalizedStringWithoutDelimiter("make", " ", "text", " ", "to", " ", "heading", " ", "(", "level", " ", String.valueOf(i), ")"), "h" + i)).toList()
    );

    public static List<List<ToolbarButton>> getToolbarLayout() {
        return TOOLBAR_BUTTON_LAYOUT;
    }

    public static class ToolbarButton {
        private final String caption;
        private final String tooltip;
        private final String htmlTagName;
        private final String className;
        private boolean canBeToggled = false;

        public ToolbarButton(String caption, String tooltip, String htmlTagName, boolean canBeToggled) {
            this.caption = caption;
            this.tooltip = tooltip;
            this.htmlTagName = htmlTagName;
            this.className = caption.replaceAll("_", "-");
            this.canBeToggled = canBeToggled;
        }

        public ToolbarButton(String caption, String tooltip, String htmlTagName) {
            this(caption, tooltip, htmlTagName, true);
        }

        public String getCaption() {
            return caption;
        }

        public String getTooltip() {
            return tooltip;
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
