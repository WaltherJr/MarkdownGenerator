package com.eriksandsten.markdowngenerator.ui;

import java.util.List;

public class ImagePanel {
    public static List<Icon> uiIcons = List.of(
        new Icon("text_ad", "Image alternative text", new BindingAttribute("attr", "alt")),
        new Icon("link", "Image URL", new BindingAttribute("attr", "src")),
        new Icon("tooltip_2", "Image title", new BindingAttribute("attr", "title"))
    );
}
