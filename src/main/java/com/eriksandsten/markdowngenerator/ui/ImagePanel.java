package com.eriksandsten.markdowngenerator.ui;

import java.util.List;

public class ImagePanel {
    public static List<Icon> uiIcons = List.of(
        new Icon("text_ad", "Image alternative text", "alt"),
        new Icon("link", "Image URL", "src"),
        new Icon("tooltip_2", "Image title", "title")
    );
}
