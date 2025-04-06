(function () {
    function checkAndModifySearch() {
        chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
            blockedSites = blockedSites || [];

            const bodyText = document.body.innerText.toLowerCase();
            const foundBlockedSites = new Set();
            const links = document.querySelectorAll('a');

            for (const website of blockedSites) {
                const websiteLower = website.toLowerCase();
                if (bodyText.includes(websiteLower)) {
                    foundBlockedSites.add(website);
                    continue;
                }

                for (const link of links) {
                    const href = link.href.toLowerCase();
                    if (href.includes(websiteLower)) {
                        foundBlockedSites.add(website);
                        break;
                    }
                }
            }

            if (foundBlockedSites.size > 0) {
                const searchInput = document.querySelector("input[name='q']");
                if (searchInput) {
                    let query = searchInput.value;
                    let newFiltersAdded = false;

                    for (const site of foundBlockedSites) {
                        const filterToAdd = ` -site:${site}`;
                        if (!query.includes(filterToAdd)) {
                            query += filterToAdd;
                            newFiltersAdded = true;
                        }
                    }

                    if (newFiltersAdded) {
                        const newUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                        window.location.replace(newUrl);
                    }
                }
            }
        });
    }

    window.addEventListener("load", () => {
        setTimeout(checkAndModifySearch, 500);
    });
})();