//ext install fn
chrome.runtime.onInstalled.addListener(function () {
    //initial empty data set...
    chrome.storage.sync.set({ sites: [] }, () => {
        console.log('Sites has been set.')
    })

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        //making ext work on all webpages
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        // pageUrl: {hostEquals: 'developer.chrome.com'},
                    }),
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ])
    })
})

//checks if page matches exsisting page notes on tab load
//if so sends msg to browswer client side in contentScript.js
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        //check if site matches notes sites
        let tablink = tab.url

        chrome.storage.sync.get('sites', function (data) {
            let sites = data.sites

            for (let i = 0; i < sites.length; i++) {
                let site = sites[i]
                if (tablink === site.url) {
                    //add a visit to site
                    let updatedSite = {
                        ...site,
                        visits: site.visits + 1,
                    }

                    let updatedSites = sites.map((s) => (s.url === site.url ? updatedSite : s))

                    chrome.storage.sync.set({ sites: updatedSites }, function () {
                        // console.log(updatedSites);
                    })

                    chrome.tabs.sendMessage(tabId, updatedSite)
                    return
                }
            }
        })
    }
})
