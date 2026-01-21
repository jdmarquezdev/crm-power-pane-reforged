(function () {
    "use strict";

    // Only run in the top frame to avoid multiple injections and CSP noise from iframes
    if (window !== window.top) return;

    if (typeof browser === "undefined") {
        var browser = chrome;
    }

    const getURL = (browser.runtime && browser.runtime.getURL) ? browser.runtime.getURL.bind(browser.runtime) : browser.extension.getURL.bind(browser.extension);

    const Interval = {
        Pointer: undefined,
        Count: 0,
        MaxTryCount: 20 // increased to give CRM more time
    };

    const ApplicationType = {
        DynamicsCRM: "Dynamics CRM",
        Dynamics365: "Dynamics 365"
    };

    function GetAppicationType() {
        if (document.querySelectorAll('body[scroll=no]').length > 0) {
            return ApplicationType.DynamicsCRM;
        } else if (document.querySelector("div[data-id=topBar]")) {
            return ApplicationType.Dynamics365;
        }
        return null;
    }

    function BuildPowerPaneButton() {
        var button = document.createElement("span");
        button.className = 'navTabButton';
        button.id = 'crm-power-pane-button';
        button.title = 'Show Dynamics CRM Power Pane';

        var link = document.createElement("a");
        link.className = "navTabButtonLink";

        var span = document.createElement("span");
        span.className = "navTabButtonImageContainer";

        var img = document.createElement("img");
        img.src = getURL("img/icon-48.png");

        if (GetAppicationType() === ApplicationType.Dynamics365) {
            button.style.cssText = 'float:left; width:48px; height:48px; cursor:pointer!important; display:flex; align-items:center; justify-content:center; overflow:hidden;';
            link.style.cssText = "display:flex; width:48px; height:48px; justify-content:center; align-items:center;";
            img.style.cssText = "width:48px; height:48px; margin:0; padding:0; display:block;";
        }

        span.appendChild(img);
        link.appendChild(span);
        button.appendChild(link);

        return button;
    }

    function InjectPowerPaneButton() {
        var button = BuildPowerPaneButton();
        var appType = GetAppicationType();

        if (appType === ApplicationType.DynamicsCRM) {
            var ribbon = document.querySelector('#navBar');
            if (ribbon) {
                ribbon.prepend(button);
                return true;
            }
        } else if (appType === ApplicationType.Dynamics365) {
            var waffle = document.querySelector("button[data-id=officewaffle]");
            if (waffle) {
                waffle.before(button);
                return true;
            }
        }
        return false;
    }

    function Initialize() {
        console.log("CrmPowerPane: Injector Initializing __VERSION__ (Top Frame)");

        browser.storage.sync.get("language", function (data) {
            var language = data.language || "en";

            Interval.Pointer = setInterval(function () {
                Interval.Count++;
                if (Interval.Count > Interval.MaxTryCount) {
                    clearInterval(Interval.Pointer);
                }

                if (!document.getElementById("crm-power-pane-button")) {
                    if (!InjectPowerPaneButton()) return;

                    var container = document.createElement("div");
                    container.className = "crm-power-pane-container";
                    container.setAttribute("data-language", language);

                    // The HTML content is inlined during build
                    var paneHtml = `__PANE_HTML__`;
                    container.innerHTML = paneHtml;

                    var body = document.querySelector('body[scroll=no]') || document.querySelector('body');
                    if (body) {
                        body.appendChild(container);
                        console.log("CrmPowerPane: UI Injected.");

                        // Inject Scripts (Order matters: jQuery -> Translations -> Pane)
                        // Inject Scripts sequentially (Waterfall) to ensure dependencies
                        var scripts = [
                            "ui/js/jquery.min.js",
                            "ui/js/translations.js",
                            "ui/js/pane.js"
                        ];

                        function injectNextScript(index) {
                            if (index >= scripts.length) return;

                            var s = document.createElement("script");
                            s.src = getURL(scripts[index]);
                            s.onload = function () {
                                this.remove();
                                injectNextScript(index + 1);
                            };
                            s.onerror = function () {
                                console.error("CrmPowerPane: Failed to load script " + scripts[index]);
                            };
                            (document.head || document.documentElement).appendChild(s);
                        }

                        injectNextScript(0);
                    }

                    // Add direct click listener as a backup to the background script message
                    var button = document.getElementById("crm-power-pane-button");
                    if (button) {
                        button.addEventListener("click", function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var sections = document.querySelector(".crm-power-pane-sections");
                            if (sections) {
                                var isHidden = (sections.style.display === "none" || sections.style.display === "");
                                sections.style.display = isHidden ? "block" : "none";
                            }
                        });
                    }
                } else {
                    clearInterval(Interval.Pointer);
                }
            }, 1000);
        });

        // Communication
        window.addEventListener("message", function (event) {
            if (event.source !== window) return;
            if (event.data && event.data.type === "CRM_POWER_PANE_SAVE_LANGUAGE") {
                browser.storage.sync.set({ "language": event.data.language });
            }
        });

        browser.runtime.onMessage.addListener(function (msg) {
            if (msg.action === "togglePowerPane") {
                var sections = document.querySelector(".crm-power-pane-sections");
                if (sections) {
                    var isHidden = (sections.style.display === "none" || sections.style.display === "");
                    sections.style.display = isHidden ? "block" : "none";
                }
            }
        });
    }

    Initialize();
})();
