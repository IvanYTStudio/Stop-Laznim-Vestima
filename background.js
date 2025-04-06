const defaultBlockedSites = [
    "informer.rs",
    "pink.rs",
    "alo.rs",
    "kurir.rs",
    "b92.net",
    "novosti.rs",
    "rts.rs",
    "predsednik.rs",
    "vucic.rs"
];

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
        if (!blockedSites) {
            chrome.storage.sync.set({ blockedSites: defaultBlockedSites });
        }
    });
});

chrome.webNavigation.onCommitted.addListener((details) => {
    chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
        blockedSites = blockedSites || defaultBlockedSites;

        if (details.url.includes("https://www.google.com/search")) {
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ['content.js']
            });
        }
    });
}, { url: [{ hostContains: "google.com" }] });