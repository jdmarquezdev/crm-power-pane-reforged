const build = (target, version) => {

    var manifest = {};

    // Common properties
    manifest.manifest_version = 2
    manifest.name = "Dynamics 365 Power Pane Reforged"
    manifest.short_name = "D365 Power Pane Reforged"
    manifest.version = version
    manifest.description = "A reforged and modernized version of the Dynamics 365 Power Pane helper tool. Secure, fast, and reliable."
    manifest.content_security_policy = "script-src 'self'; object-src 'self'"

    manifest.browser_action = {};
    manifest.browser_action.default_title = "Dynamics 365 Power Pane Reforged"

    manifest.icons = {};
    manifest.icons[32] = "img/icon-32.png"
    manifest.icons[48] = "img/icon-48.png"
    manifest.icons[64] = "img/icon-64.png"
    manifest.icons[128] = "img/icon-128.png"

    manifest.content_scripts = []
    manifest.content_scripts.push({});

    manifest.content_scripts[0].run_at = "document_end"

    manifest.content_scripts[0].matches = [];
    manifest.content_scripts[0].matches.push("<all_urls>");

    manifest.content_scripts[0].js = [];
    manifest.content_scripts[0].js.push("js/inject.js")

    manifest.content_scripts[0].css = [];
    manifest.content_scripts[0].css.push("ui/css/pane.css")

    manifest.permissions = []
    manifest.permissions.push("tabs");
    manifest.permissions.push("activeTab");
    manifest.permissions.push("storage");
    manifest.permissions.push("http://*/*");
    manifest.permissions.push("https://*/*");

    manifest.web_accessible_resources = [];
    manifest.web_accessible_resources.push("ui/*");
    manifest.web_accessible_resources.push("img/*");

    manifest.background = {};
    manifest.background.scripts = ["js/background.js"];


    // Generic conversions for Chrome MV3
    if (target === 'chrome' || target === 'edge-chromium') {
        manifest.manifest_version = 3;

        manifest.action = {
            default_title: manifest.browser_action.default_title,
            default_icon: target === 'chrome' ? "img/icon-48.png" : {
                "32": "img/icon-32.png"
            }
        };
        delete manifest.browser_action;

        manifest.host_permissions = [
            "http://*/*",
            "https://*/*"
        ];

        // Remove host permissions from permissions array
        manifest.permissions = manifest.permissions.filter(p => p !== "http://*/*" && p !== "https://*/*");
        manifest.permissions.push("scripting");

        manifest.background = {
            service_worker: "js/background.js"
        };

        manifest.content_scripts = [
            {
                run_at: "document_end",
                matches: ["<all_urls>"],
                js: ["js/inject.js"],
                css: ["ui/css/pane.css"]
            },
        ];

        manifest.web_accessible_resources = [
            {
                resources: ["ui/*", "img/*"],
                matches: ["<all_urls>"]
            }
        ];

        manifest.content_security_policy = {
            extension_pages: "script-src 'self'; object-src 'self'"
        };
    }

    return manifest;
}

module.exports = {
    build: build
};