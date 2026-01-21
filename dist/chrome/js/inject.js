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
        console.log("CrmPowerPane: Injector Initializing 0.3.0 (Top Frame)");

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
                    var paneHtml = `<div id="crm-power-pane">
    <div class="crm-power-pane-sections" tabindex="9999">
        <div class="crm-power-pane-scrolling-container">
            <ul class="crm-power-pane-section" id="user-actions">
                <li class="crm-power-pane-header" data-i18n="general">General</li>
                <li class="crm-power-pane-subgroup" id="user-info"><span><span class="icon user-info-icon"></span><span
                            data-i18n="user_info">User Info</span></span>
                <li class="crm-power-pane-subgroup" id="fetch-xml"><span><span class="icon fetch-xml-icon"></span><span
                            data-i18n="execute_fetch_xml">Execute Fetch Xml</span></span></li>

            </ul>
            <ul class="crm-power-pane-section" id="record-actions">
                <li class="crm-power-pane-header" data-i18n="record_actions">Record Actions</li>
                <li class="crm-power-pane-subgroup" id="entity-name"><span><span
                            class="icon entity-name-icon"></span><span data-i18n="entity_info">Entity Info</span></span>
                </li>
                <li class="crm-power-pane-subgroup" id="record-id"><span><span class="icon record-id-icon"></span><span
                            data-i18n="record_id">Record Id</span></span></li>
                <li class="crm-power-pane-subgroup" id="record-url"><span><span
                            class="icon record-url-icon"></span><span data-i18n="record_url">Record Url</span></span>
                </li>
                <li class="crm-power-pane-subgroup" id="clone-record"><span><span class="icon clone-record"></span><span
                            data-i18n="clone_record">Clone Record</span></span></li>
                <li class="crm-power-pane-subgroup" id="record-properties"><span><span
                            class="icon record-properties-icon"></span><span data-i18n="record_properties">Record
                            Properties</span></span></li>
            </ul>
            <ul class="crm-power-pane-section" id="form-actions" style="margin-right:10px!important">
                <li class="crm-power-pane-header" data-i18n="form_actions">Form Actions</li>
                <li class="crm-power-pane-subgroup" id="enable-all-fields"><span><span
                            class="icon enable-all-fields-icon"></span><span data-i18n="enable_all_fields">Enable All
                            Fields</span></span></li>
                <li class="crm-power-pane-subgroup" id="show-all-fields"><span><span
                            class="icon show-all-fields-icon"></span><span data-i18n="show_hidden_fields">Show Hidden
                            Fields</span></span></li>
                <li class="crm-power-pane-subgroup" id="disable-field-requirement"><span><span
                            class="icon disable-field-requirement-icon"></span><span
                            data-i18n="disable_field_requirement">Disable Field Requirement</span></span></li>
                <li class="crm-power-pane-subgroup" id="schema-names"><span><span
                            class="icon schema-names-icon"></span><span data-i18n="schema_names_as_label">Schema Names
                            as Label</span></span></li>
                <li class="crm-power-pane-subgroup" id="schema-names-as-desc"><span><span
                            class="icon schema-names-as-desc-icon"></span><span data-i18n="schema_name_copy_mode">Schema
                            Name Copy Mode</span></span></li>
                <li class="crm-power-pane-subgroup" id="schema-names-in-brackets"><span><span
                            class="icon schema-names-in-brackets-icon"></span><span
                            data-i18n="schema_names_in_brackets">Schema Names In Brackets</span></span></li>
                <li class="crm-power-pane-subgroup" id="show-optionset-values"><span><span
                            class="icon show-optionset-values-icon"></span><span data-i18n="show_optionset_values">Show
                            Optionset Values</span></span></li>
            </ul>
            <ul class="crm-power-pane-section">
                <li class="crm-power-pane-header"> </li>
                <li class="crm-power-pane-subgroup" id="show-field-value"><span><span
                            class="icon show-field-value-icon"></span><span data-i18n="show_field_value">Show Field
                            Value</span></span></li>
                <li class="crm-power-pane-subgroup" id="find-field-in-form"><span><span
                            class="icon find-field-in-form-icon"></span><span data-i18n="find_field_in_form">Find Field
                            In Form</span></span></li>
                <li class="crm-power-pane-subgroup" id="show-dirty-fields"><span><span
                            class="icon show-dirty-fields-icon"></span><span
                            data-i18n="highlight_dirty_fields">Highlight Dirty Fields</span></span></li>
                <li class="crm-power-pane-subgroup" id="clear-all-notifications"><span><span
                            class="icon clear-all-notifications-icon"></span><span
                            data-i18n="clear_all_notifications">Clear All Notifications</span></span></li>
                <li class="crm-power-pane-subgroup" id="refresh-ribbon"><span><span
                            class="icon refresh-ribbon-icon"></span><span data-i18n="refresh_ribbon">Refresh
                            Ribbon</span></span></li>
                <li class="crm-power-pane-subgroup" id="refresh-form"><span><span
                            class="icon refresh-form-icon"></span><span data-i18n="refresh_form">Refresh
                            Form</span></span></li>
                <li class="crm-power-pane-subgroup" id="toggle-lookup-links"><span><span
                            class="icon toggle-lookup-links-icon"></span><span data-i18n="toggle_lookup_links">Toggle
                            Lookup Links</span></span></li>
            </ul>
            <ul class="crm-power-pane-section" id="form-actions">
                <li class="crm-power-pane-header" data-i18n="navigations">Navigations</li>
                <li class="crm-power-pane-subgroup" id="go-to-record"><span><span
                            class="icon go-to-record-icon"></span><span data-i18n="go_to_record_by_id">Go to Record by
                            Id</span></span></li>
                <li class="crm-power-pane-subgroup" id="go-to-create-form"><span><span
                            class="icon go-to-create-form"></span><span data-i18n="go_to_create_form">Go to Create
                            Form</span></span></li>
                <li class="crm-power-pane-subgroup" id="open-form-editor"><span><span
                            class="icon form-editor-icon"></span><span data-i18n="form_editor">Form Editor</span></span>
                </li>
                <li class="crm-power-pane-subgroup" id="open-entity-editor"><span><span
                            class="icon entity-editor-icon"></span><span data-i18n="entity_editor">Entity
                            Editor</span></span></li>
                <li class="crm-power-pane-subgroup" id="solutions"><span><span class="icon solutions-icon"></span><span
                            data-i18n="solutions">Solutions</span></span></li>
                <li class="crm-power-pane-subgroup" id="crm-diagnostics"><span><span
                            class="icon crm-diagnostics-icon"></span><span data-i18n="crm_diagnostics">Crm
                            Diagnostics</span></span></li>
                <li class="crm-power-pane-subgroup" id="performance-center"><span><span
                            class="icon performance-center-icon"></span><span data-i18n="performance_center">Performance
                            Center</span></span></li>
            </ul>
            <ul class="crm-power-pane-section">
                <li class="crm-power-pane-header"> </li>
                <li class="crm-power-pane-subgroup" id="mobile-client"><span><span class="icon mobile-icon"></span><span
                            data-i18n="mobile_client">Mobile Client</span></span></li>
                <li class="crm-power-pane-subgroup" id="open-webapi"><span><span
                            class="icon record-url-icon"></span><span data-i18n="open_web_api_record">Open Web API
                            Record</span></span></li>
            </ul>
        </div>
        <div id="crm-power-pane-notes" style="clear:both">
            <div style="float: right; margin-top: 10px; margin-left: 20px; text-align: right;">
                <div style="margin-bottom: 5px;">
                    <span data-i18n="version_label">Version</span>: <span>0.3.0</span>
                </div>
                <div>
                    <span data-i18n="language">Language</span>:
                    <select id="crm-power-pane-language-selector"
                        style="background: #1160B7; color: white; border: none; padding: 2px 5px; cursor: pointer;">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
            </div>
            <div id="crm-power-pane-note" data-i18n="disclaimer">Dynamics CRM Power Pane is not recommended for
                end-users or production use. The extension is developed for developers, testers and power users to ease
                development, unit and system testing efforts.</div>
        </div>
    </div>
    <div id="crm-power-pane-popup-bg"></div>
    <div id="crm-power-pane-popup">
        <h1 class="crm-power-pane-popup-header">Header</h1>
        <p class="crm-power-pane-popup-description">description</p>
        <ul>
        </ul>
        <div style="clear:both"></div>
        <div id="crm-power-pane-button-container">
            <button class="crm-power-pane-button" id="crm-power-pane-popup-ok" data-i18n="ok">OK</button>
            <button class="crm-power-pane-button" id="crm-power-pane-popup-cancel" data-i18n="cancel">Cancel</button>
        </div>
    </div>
    <div id="crm-power-pane-notification">
        <span></span>
    </div>
    <div id="crm-power-pane-fetchxml-popup" class="crm-power-pane-advenced-popup">
        <h1 class="crm-power-pane-popup-header" data-i18n="execute_fetch_xml">Execute Fetch Xml</h1>
        <p class="crm-power-pane-popup-description" data-i18n="fetch_xml_desc">Executes your fetch xml query and shows
            to you result.</p>
        <div style="clear:both"></div>
        <div id="crm-power-pane-fetchxml-popup-container">
            <ul>
                <li class="dynamics-crm-power-pane-active-tab" data-i18n="execute_fetch_xml">Execute Fetch Xml</li>
                <li data-i18n="result">Result</li>
            </ul>
            <div id="crm-power-pane-fetchxml-popup-tabs">
                <div id="crm-power-pane-tab1" class="crm-power-pane-fetchxml-tab ">
                    <textarea class="crm-power-pane-texarea" data-i18n-placeholder="fetch_xml_placeholder"
                        placeholder="//put your xml here for execute"></textarea>
                </div>
                <div id="crm-power-pane-tab2" class="crm-power-pane-fetchxml-tab">
                    <textarea id="crm-power-pane-fetchxml-result-area" class="crm-power-pane-texarea"></textarea>
                </div>
            </div>
            <div id="crm-power-pane-button-container">
                <button class="crm-power-pane-button" id="crm-power-pane-popup-ok-fetch" data-i18n="ok">OK</button>
                <button class="crm-power-pane-button" id="crm-power-pane-popup-cancel-fetch"
                    data-i18n="close">Close</button>
            </div>
        </div>
    </div>
    <div style="clear:both"></div>

    <div id="crm-power-pane-solutions-popup" class="crm-power-pane-advenced-popup">
        <h1 class="crm-power-pane-popup-header" data-i18n="solutions">Solutions</h1>
        <p class="crm-power-pane-popup-description" data-i18n="solutions_desc">List of loaded solutions at the current
            organization.</p>

        <div class="dynamics-crm-power-pane-table-filter">
            <span class="crm-power-pane-popup-input-text"><span data-i18n="search_in_list">Search in list :</span>
            </span>
            <input type="text" />
        </div>
        <table cellspacing="0" cellpadding="1" class="dynamics-crm-power-pane-table">
            <thead>
                <tr>
                    <th data-i18n="display_name">Display Name</th>
                    <th data-i18n="unique_name">Unique Name</th>
                    <th data-i18n="version">Version</th>
                    <th data-i18n="management_type">Management Type</th>
                    <th data-i18n="installed_on">Installed On</th>
                    <th data-i18n="export">Export</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td data-i18n="display_name">Display Name</td>
                    <td data-i18n="unique_name">Unique Name</td>
                    <td data-i18n="version">Version</td>
                    <td data-i18n="management_type">Management Type</td>
                    <td data-i18n="installed_on">Installed On</td>
                    <td data-i18n="export">Export</td>
                </tr>
            </tbody>
        </table>
        <div id="crm-power-pane-button-container">
            <button class="crm-power-pane-button" id="crm-power-pane-popup-ok-fetch" data-i18n="ok">OK</button>
            <button class="crm-power-pane-button" id="crm-power-pane-popup-cancel-fetch"
                data-i18n="close">Close</button>
        </div>
    </div>
</div>`;
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
