package com.eriksandsten.markdowngenerator.ui;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public final class MaterialIcons {
    public static String getAppIconsList() {
        var combined =
                Stream.of(
                        MainToolbar.getToolbarLayout().stream().flatMap(List::stream).map(MainToolbar.ToolbarButton::getCaption),
                        LinkPanel.uiIcons.stream().map(Icon::name),
                        ImagePanel.uiIcons.stream().map(Icon::name),
                        MoveElementPanel.uiIcons.stream().map(Icon::name))
                        .flatMap(Function.identity());

        return combined.distinct().sorted().collect(Collectors.joining(","));
    }
}
