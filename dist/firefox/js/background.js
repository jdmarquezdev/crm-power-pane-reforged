// Manifest V3 compatibility (Service Worker)
const action = chrome.action || chrome.browserAction;

action.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { action: "togglePowerPane" });
});
