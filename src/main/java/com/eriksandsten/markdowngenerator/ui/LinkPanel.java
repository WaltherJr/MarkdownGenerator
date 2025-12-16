package com.eriksandsten.markdowngenerator.ui;

import java.util.List;

public class LinkPanel {
    public static List<Icon> uiIcons = List.of(
            new Icon("link", "Link URL", new BindingAttribute("attr", "href")),
            new Icon("tooltip_2", "Link title", new BindingAttribute("attr", "title"))
    );
}
