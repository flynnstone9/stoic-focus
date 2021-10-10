chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == 'install') {
        chrome.storage.sync.set(
            {
                sites: [],
                options: {
                    fullscreen: false,
                    timer: 10,
                    closePopupBeforeTimer: true,
                },
            },
            () => {
                console.log('Sites has been set.')
            }
        )
    }
})

chrome.browserAction.onClicked.addListener(function (tab) {
    if (changeInfo.status === 'complete') {
        chrome.pageAction.show(tab)
    } else {
        chrome.pageAction.hide(tab)
    }
})

//checks if page matches exsisting page notes on tab load
//if so sends msg to browswer client side in contentScript.js
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    let browser = getBrowser()
    let checkUrl = null
    if (browser === 'Firefox') {
        checkUrl = changeInfo.url
    } else {
        checkUrl = true
    }

    if (changeInfo.status == 'complete' && tab.active) {
        //check if site matches notes sites
        let tablink = tab.url

        chrome.storage.sync.get(null, function ({ sites, options }) {
            for (let i = 0; i < sites.length; i++) {
                let site = sites[i]

                if (tablink === site.url) {
                    //add a visit to site
                    let updatedSite = {
                        ...site,
                        visits: site.visits + 1,
                    }

                    let updatedSites = sites.map((s) => (s.url === site.url ? updatedSite : s))

                    chrome.storage.sync.set({ sites: updatedSites }, function () {})

                    chrome.tabs.sendMessage(tabId, { updatedSite, browser, options })
                    return
                }
            }
        })
    }
})

function getBrowser() {
    if (typeof chrome !== 'undefined') {
        if (typeof browser !== 'undefined') {
            return 'Firefox'
        } else {
            return 'Chrome'
        }
    } else {
        return 'Edge'
    }
}
