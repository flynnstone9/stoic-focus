let siteInfo = document.getElementById('siteInfo')
let isCurrentSiteAlreadyAdded = false

chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tab) {
    let tablink = tab[0].url

    //set ui based on if msg set for site already
    chrome.storage.sync.get(null, function ({ options, sites }) {
        let isCurrentSiteAlreadyAdded

        let optionsDiv = document.querySelector('div.options')
        optionsDiv.textContent = "Open Extension's Options"

        let manifestData = chrome.runtime.getManifest()
        let versionSpan = document.querySelector('span.version__number')
        versionSpan.innerText = `${manifestData.version}`

        optionsDiv.addEventListener('click', () => {
            let browser = getBrowser()
            let url = browser !== 'Firefox' ? 'views/options.html' : 'options.html'
            chrome.tabs.create({ url: url })
        })

        for (let i = 0; i < sites.length; i++) {
            let { url, msg, dateCreated, visits, domainLevelBlock } = sites[i]
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

                let buildDiv = (text) => {
                    let urlLink = document.createElement('div')
                    urlLink.classList = 'url__link'
                    urlLink.textContent = `${text}`
                    return urlLink
                }

                let urlSpanLink = buildDiv(url)
                let dateDiv = buildStatusDiv('Date Created:')
                let urlDateLink = buildDiv(formatDate(dateCreated))
                let domainlvlDiv = buildStatusDiv('Domain Lvl:')
                let urlDomainLvl = buildDiv(domainLevelBlock === true ? 'Domain Lvl' : 'Not Active')
                let visitsDiv = buildStatusDiv('# of Visits')
                let urlVisitsLink = buildDiv(visits)

                urlDiv.appendChild(msgDiv)
                urlDiv.appendChild(activeDiv)
                urlDiv.appendChild(urlSpanLink)
                urlDiv.appendChild(dateDiv)
                urlDiv.appendChild(urlDateLink)
                urlDiv.appendChild(domainlvlDiv)
                urlDiv.appendChild(urlDomainLvl)
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

            let urlLink = document.createElement('div')
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

            // let checkboxDomainLvl = document.createElement('input')
            // checkboxDomainLvl.setAttribute('type', 'checkbox')
            // checkboxDomainLvl.setAttribute('id', 'domainLevel')
            // checkboxDomainLvl.setAttribute('name', 'domainLevel')
            // checkboxDomainLvl.classList = 'input__checkbox'

            let btnsContainer = document.createElement('div')
            btnsContainer.classList = 'button-container'

            let submitBtn = document.createElement('button')
            submitBtn.setAttribute('type', 'submit')
            submitBtn.id = 'submitBtn'
            submitBtn.innerText = `Activate ${options.isPopupBtnDomainLvl ? '(Domain)' : '(Site)'}`
            function submitMsg(e) {
                e.preventDefault()
                const currentTime = new Date().toJSON()

                const isDomainLvl = document.getElementById('submitBtn').innerText.includes('DOMAIN')

                console.log('isDomainlvl', isDomainLvl)

                let newSite = {
                    msg: input.value,
                    url: tablink,
                    dateCreated: currentTime,
                    domainLevelBlock: isDomainLvl,
                    visits: 0,
                }

                sites.push(newSite)
                chrome.storage.sync.set({ sites: sites }, function () {})

                window.close()
            }

            let dropDownBtn = document.createElement('button')
            dropDownBtn.setAttribute('type', 'button')
            dropDownBtn.classList.add('btn-small')
            dropDownBtn.innerHTML = '&#x25BC;'

            function openBtnLevelMenu({ target }) {
                console.log(target)
                console.log(target.parentElement)
            }

            let dropdownContainer = document.createElement('div')
            dropdownContainer.classList = 'dropdown-container'

            let siteLvlDivBtn = document.createElement('div')
            siteLvlDivBtn.classList = 'dropdown-item'
            siteLvlDivBtn.id = 'sitelvl'
            siteLvlDivBtn.textContent = 'Site Lvl'
            let domainLvlDivBtn = document.createElement('div')
            domainLvlDivBtn.classList = 'dropdown-item'
            domainLvlDivBtn.id = 'domainlvl'
            domainLvlDivBtn.textContent = 'Domain Lvl'
            // options.isPopupBtnDomainLvl
            //     ? domainLvlDivBtn.classList.add('dropdown-item--active')
            //     : siteLvlDivBtn.classList.add('dropdown-item--active')

            function updateBtnLevel({ target }) {
                console.log(target)
                const isDomainLvl = target.id === 'domainlvl' ? true : false

                const updatedOptions = {
                    ...options,
                    isPopupBtnDomainLvl: isDomainLvl,
                }

                chrome.storage.sync.set({ options: updatedOptions }, function () {})
                submitBtn.innerText = `Activate ${isDomainLvl ? '(Domain)' : '(Site)'}`
            }

            domainLvlDivBtn.addEventListener('click', updateBtnLevel)
            siteLvlDivBtn.addEventListener('click', updateBtnLevel)
            dropdownContainer.appendChild(siteLvlDivBtn)
            dropdownContainer.appendChild(domainLvlDivBtn)

            inputDiv.appendChild(input)
            // inputDiv.appendChild(checkboxDomainLvl)

            btnsContainer.appendChild(submitBtn)
            inputDiv.addEventListener('submit', submitMsg)
            btnsContainer.appendChild(dropDownBtn)
            dropDownBtn.addEventListener('click', openBtnLevelMenu)
            btnsContainer.appendChild(dropdownContainer)
            inputDiv.appendChild(btnsContainer)

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
