const newSiteInput = document.getElementById("new-site");
const addSiteButton = document.getElementById("add-site");
const blockedSitesList = document.getElementById("blocked-sites-list");
const toggleButton = document.getElementById("toggle-btn");
const blockedSitesTitle = document.querySelector("h4");

function loadBlockedSites() {
    chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
        blockedSites = blockedSites || [];
        blockedSitesList.innerHTML = '';
        blockedSites.forEach(site => {
            const listItem = document.createElement("li");
            listItem.textContent = site;

            const removeButton = document.createElement("span");
            removeButton.textContent = "X";
            removeButton.classList.add("remove-btn");
            removeButton.addEventListener("click", () => removeSite(site));

            listItem.appendChild(removeButton);
            blockedSitesList.appendChild(listItem);
        });
        updateVisibility(blockedSites.length > 0);
    });
}

addSiteButton.addEventListener("click", () => {
    const newSite = newSiteInput.value.trim();
    if (newSite && !newSite.includes('http')) {
        chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
            blockedSites = blockedSites || [];
            if (!blockedSites.includes(newSite.trim())) {
                blockedSites.push(newSite);
                chrome.storage.sync.set({ blockedSites }, () => {
                    loadBlockedSites();
                    newSiteInput.value = '';
                });
            }
        });
    } else {
        alert("Unesite sajt (bez http/https i bez www)");
    }
});

function removeSite(siteToRemove) {
    chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
        blockedSites = blockedSites || [];
        const updatedBlockedSites = blockedSites.filter(site => site !== siteToRemove);
        chrome.storage.sync.set({ blockedSites: updatedBlockedSites }, () => {
            loadBlockedSites();
        });
    });
}

function updateVisibility(filtersEnabled) {
    blockedSitesTitle.style.display = filtersEnabled ? 'block' : 'none';
    newSiteInput.style.display = filtersEnabled ? 'block' : 'none';
    addSiteButton.style.display = filtersEnabled ? 'block' : 'none';
    blockedSitesList.style.display = filtersEnabled ? 'block' : 'none';
}

toggleButton.addEventListener("click", () => {
    chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
        if (blockedSites && blockedSites.length > 0) {
            chrome.storage.sync.set({ blockedSitesBackup: blockedSites }, () => {
                chrome.storage.sync.set({ blockedSites: [] }, () => {
                    loadBlockedSites();
                    toggleButton.textContent = "Uključi filtere";
                });
            });
        } else {
            chrome.storage.sync.get("blockedSitesBackup", ({ blockedSitesBackup }) => {
                if (blockedSitesBackup) {
                    chrome.storage.sync.set({ blockedSites: blockedSitesBackup }, () => {
                        loadBlockedSites();
                        toggleButton.textContent = "Isključi filtere";
                        chrome.storage.sync.remove("blockedSitesBackup");
                    });
                }
            });
        }
    });
});

function checkExtensionState() {
    chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
        const filtersEnabled = blockedSites && blockedSites.length > 0;
        toggleButton.textContent = filtersEnabled ? "Isključi filtere" : "Uključi filtere";
        updateVisibility(filtersEnabled);
    });
}

loadBlockedSites();
checkExtensionState();