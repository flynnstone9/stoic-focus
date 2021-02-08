let siteInfo = document.getElementById('siteInfo')
let isCurrentSiteAlreadyAdded = false

chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tab) {
    let tablink = tab[0].url

    //set ui based on if msg set for site already
    chrome.storage.sync.get('sites', function (data) {
        let sites = data.sites
        let isCurrentSiteAlreadyAdded

        let options = document.querySelector('div.options')
        options.textContent = "Open Extension's Options"

        options.addEventListener('click', () => {
            let browser = getBrowser()
            let url = browser !== 'Firefox' ? 'views/options.html' : 'options.html'
            chrome.tabs.create({ url: url })
        })

        for (let i = 0; i < sites.length; i++) {
            let { url, msg, dateCreated, visits } = sites[i]
            // console.log('looped', url, tablink)
            if (tablink === url) {
                isCurrentSiteAlreadyAdded = true
                let exsistingSiteText = document.createElement('div')
                exsistingSiteText.classList = 'siteInfo__container'

                let urlDiv = document.createElement('div')
                urlDiv.classList = 'url'

                let msgDiv = document.createElement('div')
                msgDiv.classList = 'msg'
                let msgDivSpan = document.createElement('span')
                msgDivSpan.classList = 'url__status url__status--active'
                msgDivSpan.innerText = `current msg`
                msgDiv.innerText += `: ${msg}`
                msgDiv.insertBefore(msgDivSpan, msgDiv.firstChild)

                let buildStatusDiv = (text) => {
                    let statusDiv = document.createElement('div')
                    statusDiv.classList = 'url__status'
                    let statusDivSpan = document.createElement('span')
                    statusDivSpan.classList = 'url__status--active'
                    statusDivSpan.textContent = `${text}`
                    statusDiv.appendChild(statusDivSpan)
                    return statusDiv
                }

                let activeDiv = buildStatusDiv('active:')

                let buildSpan = (text) => {
                    let urlLink = document.createElement('span')
                    urlLink.classList = 'url__link'
                    urlLink.textContent = `${text}`
                    return urlLink
                }

                let urlSpanLink = buildSpan(url)
                let dateDiv = buildStatusDiv('Date Created:')
                let urlDateLink = buildSpan(formatDate(dateCreated))
                let visitsDiv = buildStatusDiv('# of Visits')
                let urlVisitsLink = buildSpan(visits)

                urlDiv.appendChild(msgDiv)
                urlDiv.appendChild(activeDiv)
                urlDiv.appendChild(urlSpanLink)
                urlDiv.appendChild(dateDiv)
                urlDiv.appendChild(urlDateLink)
                urlDiv.appendChild(visitsDiv)
                urlDiv.appendChild(urlVisitsLink)

                exsistingSiteText.appendChild(urlDiv)

                siteInfo.appendChild(exsistingSiteText)

                let deleteBtn = document.createElement('button')
                deleteBtn.innerText = 'Deactivate'
                deleteBtn.onclick = function (e) {
                    e.preventDefault()

                    let updatedSites = sites.filter((s) => s !== sites[i])
                    chrome.storage.sync.set({ sites: updatedSites }, function () {})

                    window.close()
                }

                siteInfo.appendChild(deleteBtn)
                return
            }
        }

        if (!isCurrentSiteAlreadyAdded) {
            let exsistingSiteText = document.createElement('div')
            exsistingSiteText.classList = 'siteInfo__container'

            let status = document.createElement('div')
            status.classList = 'url'

            let statusDiv = document.createElement('div')
            statusDiv.classList = 'url__status'
            let statusDivSpan = document.createElement('span')
            statusDivSpan.classList = 'url__status url__status--notactive'
            statusDivSpan.textContent = 'not active'
            statusDiv.appendChild(statusDivSpan)

            let urlLink = document.createElement('span')
            urlLink.classList = 'url__link'
            urlLink.textContent = `${tablink}`

            status.appendChild(statusDiv)
            status.appendChild(urlLink)

            let inputDiv = document.createElement('form')
            inputDiv.classList = 'input__container'

            let input = document.createElement('input')
            input.setAttribute('type', 'text')
            input.setAttribute('id', 'sitemsg')
            input.setAttribute('name', 'sitemsg')
            input.setAttribute('autocomplete', 'off')
            input.setAttribute('placeholder', 'Add Message For Site')
            input.classList = 'input__input'

            let submitBtn = document.createElement('button')
            submitBtn.setAttribute('type', 'submit')
            submitBtn.innerText = 'Activate'
            function submitMsg(e) {
                e.preventDefault()
                const currentTime = new Date().toJSON()

                let newSite = {
                    msg: input.value,
                    url: tablink,
                    dateCreated: currentTime,
                    visits: 0,
                }

                sites.push(newSite)
                chrome.storage.sync.set({ sites: sites }, function () {})

                window.close()
            }

            inputDiv.appendChild(input)
            inputDiv.appendChild(submitBtn)
            inputDiv.addEventListener('submit', submitMsg)
            exsistingSiteText.appendChild(inputDiv)
            exsistingSiteText.appendChild(status)
            siteInfo.appendChild(exsistingSiteText)
        }
    })
})

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [month, day, year].join('/')
}

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
