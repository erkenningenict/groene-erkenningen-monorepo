<?php

function test_plugin_menu()
{
    add_options_page(
        "My Plugin Options",
        "My Plugin",
        "manage_options",
        "my-plugin-options",
        "test_plugin_options_page"
    );
}
add_action("admin_menu", "test_plugin_menu");

function test_plugin_options_page()
{
    echo "<h2>Test Plugin Options</h2>";
    echo "<p>Settings for my custom plugin.</p>";
}
