if (typeof browser === "undefined") {
    browser = chrome;
}

const getURL = (browser.runtime && browser.runtime.getURL) ? browser.runtime.getURL.bind(browser.runtime) : browser.extension.getURL.bind(browser.extension);

// Saves options to chrome.storage
function saveOptions() {
    var dataToSave = {}
    var options = document.forms[0].elements;
    for (var i = 0; i < options.length; i++) {
        dataToSave[options[i].id] = options[i].checked
    }
    browser.storage.sync.set(dataToSave, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = L.t('options_saved');
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

var L = {
    CurrentLanguage: "en",
    t: function (key, params) {
        var translation = CrmPowerPaneTranslations[this.CurrentLanguage][key] || key;
        if (params) {
            if (Array.isArray(params)) {
                params.forEach(function (p, i) {
                    translation = translation.replace("{" + i + "}", p);
                });
            } else {
                translation = translation.replace("{0}", params);
            }
        }
        return translation;
    },
    populate: function () {
        var self = this;
        var elements = document.querySelectorAll("[data-i18n]");
        for (var i = 0; i < elements.length; i++) {
            var key = elements[i].getAttribute("data-i18n");
            elements[i].innerHTML = self.t(key);
        }
    },
    init: function (callback) {
        var self = this;
        browser.storage.sync.get("language", function (data) {
            if (data.language) {
                self.CurrentLanguage = data.language;
            }
            self.populate();
            if (callback) callback();
        });
    }
};

// Loads options from chrome.storage
function loadOptions() {
    browser.storage.sync.get(null, function (options) {
        for (var option in options) {
            if (!options.hasOwnProperty(option)) continue;
            var optionCheckbox = document.getElementById(option);
            if (optionCheckbox) optionCheckbox.checked = options[option]
        }
    });
}

// Generates options page based on pane.html content
function generateOptionsPage() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", getURL("ui/pane.html"), true);
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            parser = new DOMParser();
            paneDocument = parser.parseFromString(xmlHttp.responseText, "text/html");
            var paneSections = paneDocument.getElementsByClassName("crm-power-pane-section");
            var options = document.getElementById("options");
            for (var i = 0; i < paneSections.length; i++) {
                var optionsGroup = document.createElement('div');
                var groupHeader = document.createElement("h3");
                var headerElement = paneSections[i].getElementsByClassName("crm-power-pane-header")[0];
                var headerI18nKey = headerElement.getAttribute("data-i18n");
                groupHeader.innerHTML = headerI18nKey ? L.t(headerI18nKey) : headerElement.innerHTML;

                optionsGroup.appendChild(groupHeader);
                var paneItems = paneSections[i].getElementsByClassName("crm-power-pane-subgroup");
                for (var j = 0; j < paneItems.length; j++) {
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = true;
                    checkbox.id = paneItems[j].id;
                    var optionsItem = document.createElement("label");
                    optionsItem.htmlFor = paneItems[j].id;
                    optionsItem.appendChild(checkbox);

                    var labelSpan = paneItems[j].querySelector("[data-i18n]");
                    var labelText = labelSpan ? L.t(labelSpan.getAttribute("data-i18n")) : paneItems[j].children[0].innerText;

                    optionsItem.appendChild(document.createTextNode(labelText));
                    optionsGroup.appendChild(optionsItem);
                }
                options.appendChild(optionsGroup);
            }
            loadOptions();
        }
    }
    xmlHttp.send(null);
}

document.addEventListener('DOMContentLoaded', function () {
    L.init(function () {
        generateOptionsPage();
    });
});
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('select-all').addEventListener('click', function () {
    var checkboxes = document.forms[0].elements;
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true
    }
});
document.getElementById('deselect-all').addEventListener('click', function () {
    var checkboxes = document.forms[0].elements;
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false
    }
});