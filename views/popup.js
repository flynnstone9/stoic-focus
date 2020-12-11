let siteInfo = document.getElementById('siteInfo')
let isCurrentSiteAlreadyAdded = false

chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tab) {
    let tablink = tab[0].url

    //set ui based on if msg set for site already
    chrome.storage.sync.get('sites', function (data) {
        let sites = data.sites
        let isCurrentSiteAlreadyAdded

        for (let i = 0; i < sites.length; i++) {
            let { url, msg, dateCreated, visits } = sites[i]
            // console.log('looped', url, tablink)
            if (tablink === url) {
                isCurrentSiteAlreadyAdded = true
                let exsistingSiteText = document.createElement('div')
                exsistingSiteText.classList = 'siteInfo__container'
                exsistingSiteText.innerHTML = `<div class="url">
                    <div class="msg"><span class="url__status url__status--active">current msg</span>: ${msg}</div>  
                    <div class="url__status "><span class="url__status--active">active:</span></div>
                    <span class="url__link">${url}</span>
                    <div class="url__status "><span class="url__status--active">Date Created</span>:</div>
                    <span class="url__link">${formatDate(dateCreated)}</span>
                    <div class="url__status "><span class="url__status--active"># of Visits</span>:</div>
                    <span class="url__link">${visits}</span>
                </div>`
                siteInfo.appendChild(exsistingSiteText)

                let deleteBtn = document.createElement('button')
                deleteBtn.innerText = 'Deactivate'
                deleteBtn.onclick = function (e) {
                    e.preventDefault()
                    // console.log('delete btn clicked')
                    // console.log(sites[i])

                    let updatedSites = sites.filter((s) => s !== sites[i])
                    chrome.storage.sync.set(
                        {
                            sites: updatedSites,
                        },
                        function () {
                            // console.log('Value is set to ' + sites)
                        }
                    )

                    window.close()
                }

                // siteInfo.appendChild(editBtn)
                siteInfo.appendChild(deleteBtn)

                return
            }
        }

        if (!isCurrentSiteAlreadyAdded) {
            let exsistingSiteText = document.createElement('div')
            exsistingSiteText.classList = 'siteInfo__container'

            let status = document.createElement('div')
            status.classList = 'url'
            status.innerHTML = `<div class="url__status "><span class="url__status url__status--notactive">not active</span></div><span class="url__link">${tablink}</span>`

            let inputDiv = document.createElement('form')
            inputDiv.classList = 'input__container'

            // inputDiv.innerHTML = `<div class="input__title">Add Msg For Site</div>`

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
                // console.log('hey', e.target, input.value)

                const currentTime = new Date().toJSON()

                let newSite = {
                    msg: input.value,
                    url: tablink,
                    dateCreated: currentTime,
                    visits: 0,
                }

                sites.push(newSite)
                // console.log(sites, 'added new site')

                chrome.storage.sync.set(
                    {
                        sites: sites,
                    },
                    function () {
                        // console.log('Value is set to ' + sites)
                    }
                )

                window.close()
            }

            inputDiv.appendChild(input)
            inputDiv.appendChild(submitBtn)
            inputDiv.addEventListener('submit', submitMsg)
            exsistingSiteText.appendChild(inputDiv)
            exsistingSiteText.appendChild(status)
            siteInfo.appendChild(exsistingSiteText)
            // console.log('site is not already active')
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
