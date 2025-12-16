package com.eriksandsten.markdowngenerator.ui;

import java.util.List;

public class TablePanel {
    public static List<Icon> uiIcons = List.of(
            new Icon("text_ad", "Table caption", new BindingAttribute("attr", "alt"))
    );
}
