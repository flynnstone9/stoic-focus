chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == 'install') {
        chrome.storage.sync.set(
            {
                sites: [],
                options: {
                    fullscreen: false,
                    timer: 15,
                    timerOff: false,
                    closePopupBeforeTimer: true,
                    opaque: false,
                    stoicQuotes: true,
                    isPopupBtnDomainLvl: false,
                    viewCounter: true,
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
        const tablink = tab.url
        const domainTablink = getSiteRootDomain(tablink)

        chrome.storage.sync.get(null, function ({ sites, options }) {
            let sortedSites = sites.sort(function (a, b) {
                //moves site lvl before domain lvl
                return a.domainLevelBlock - b.domainLevelBlock
            })

            for (let i = 0; i < sortedSites.length; i++) {
                let site = sites[i]

                if (site.domainLevelBlock) {
                    let siteRootDomain = getSiteRootDomain(site.url)

                    if (domainTablink === siteRootDomain) {
                        const updatedSite = updateSite(sites, site)
                        sendClientMessage(tabId, { updatedSite, browser, options, siteRootDomain })
                        return
                    }
                }

                if (tablink === site.url) {
                    const updatedSite = updateSite(sites, site)
                    sendClientMessage(tabId, { updatedSite, browser, options })
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

function getSiteRootDomain(url) {
    return url
        .replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .split('.')
        .splice(0, 2)
        .join('.')
        .split('/')[0]
}

function updateSite(sites, site) {
    const updatedSite = {
        ...site,
        visits: site.visits + 1,
    }

    let updatedSites = sites.map((s) => (s.url === site.url ? updatedSite : s))
    chrome.storage.sync.set({ sites: updatedSites }, function () {})
    return updatedSite
}

function sendClientMessage(tabId, message) {
    chrome.tabs.sendMessage(tabId, message)
}
