chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ sites: [] }, () => {
        console.log('Sites has been set.')
    })
})

chrome.browserAction.onClicked.addListener(function (tab) {
    if (changeInfo.status === 'complete') {
        console.log('checking out listener')
        chrome.pageAction.show(tab)
    } else {
        chrome.pageAction.hide(tab)
    }
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
