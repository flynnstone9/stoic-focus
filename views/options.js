import formatDate from '../services/formatDate.js'
// Saves options to chrome.storage
function save_options() {
    let timer = document.getElementById('timer').value
    let fullscreen = document.getElementById('fullscreen').checked

    let usersOptions = {
        fullscreen,
        timer: timer,
    }

    chrome.storage.sync.set(
        {
            options: usersOptions,
        },
        function () {
            // Update status to let user know options were saved.
            var status = document.getElementById('status')
            status.textContent = 'Options saved.'
            setTimeout(function () {
                status.textContent = ''
            }, 1550)
        }
    )
}

// Restores select box and checkbox state using the preferences
// Displays Current Popups
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(null, function ({ options, sites }) {
        console.log(options, 'options', sites, 'sites')
        document.getElementById('timer').value = options.timer
        document.getElementById('timer').placeholder = 'Add Display Time'
        document.getElementById('fullscreen').checked = options.fullscreen

        let siteListContainer = document.getElementById('options__popups__siteList')
        let siteListTable = document.getElementById('options__popups__siteList__table')
        let headerText = document.createElement('span')
        headerText.classList = 'options__popups__header'
        if (sites[0]) {
            headerText.textContent = 'Your Current Popups'
            siteListContainer.prepend(headerText)

            sites.forEach((site) => {
                let { dateCreated, msg, url, visits } = site
                let siteDiv = document.createElement('div')
                siteDiv.classList = 'options__popups_sitelist__li'

                let urlDiv = document.createElement('div')
                urlDiv.textContent = url

                let msgDiv = document.createElement('div')
                msgDiv.textContent = msg
                msgDiv.classList = 'options__popups_sitelist__li__msg'

                let visitsDiv = document.createElement('div')
                visitsDiv.textContent = `Visits: ${visits}`

                let dateCreatedDiv = document.createElement('div')
                dateCreatedDiv.textContent = formatDate(dateCreated)

                siteDiv.appendChild(urlDiv)
                siteDiv.appendChild(msgDiv)
                siteDiv.appendChild(visitsDiv)
                siteDiv.appendChild(dateCreatedDiv)
                siteListTable.appendChild(siteDiv)
            })
        } else {
            headerText.textContent = 'No Sites Set Yet'
            siteListContainer.appendChild(headerText)
        }
    })
}

document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('save').addEventListener('click', save_options)
