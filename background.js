chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == 'install') {
        chrome.storage.sync.set(
            {
                sites: [],
                options: {
                    fullscreen: false,
                    timer: 15,
                    closePopupBeforeTimer: true,
                    opaque: false,
                    stoicQuotes: true,
                    isPopupBtnDomainLvl: false,
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
            const sortedSites = sites.sort(function (x, y) {
                //moves site lvl before domain lvl
                return x.domainLevelBlock === y.domainLevelBlock ? 0 : x ? -1 : 1
            })

            for (let i = 0; i < sortedSites.length; i++) {
                let site = sites[i]

                if (site.domainLevelBlock) {
                    console.log('is a domain lvl')
                    console.log(domainTablink, getSiteRootDomain(site.url))

                    if (domainTablink === getSiteRootDomain(site.url)) {
                        const updatedSite = updateSite(sites, site)
                        sendClientMessage(tabId, { updatedSite, browser, options })
                        return
                    }
                }

                if (tablink === site.url) {
                    //add a visit to site
                    console.log('old check')
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
    // console.log(url, typeof url, 'url passed to get site lvl')
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
