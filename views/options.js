import formatDate from '../services/formatDate.js'
// Saves options to chrome.storage
function save_options() {
    const timer = document.getElementById('timer').value
    const timerOff = document.getElementById('timerOff').checked
    const fullscreen = document.getElementById('fullscreen').checked
    const closePopupBeforeTimer = document.getElementById('closePopupBeforeTimer').checked
    const opaque = document.getElementById('opaque').checked
    const stoicQuotes = document.getElementById('stoicQuotes').checked
    const viewCounter = document.getElementById('viewCounter').checked

    const usersOptions = {
        fullscreen,
        timer: timer > 10000000 ? 10000000 : timer,
        timerOff: timerOff,
        closePopupBeforeTimer,
        opaque,
        stoicQuotes,
        viewCounter,
    }

    chrome.storage.sync.set(
        {
            options: usersOptions,
        },
        function () {
            // Update status to let user know options were saved.
            const status = document.getElementById('status')
            status.textContent = 'Options saved.'
            status.classList = ''
            document.getElementById('save').classList.remove('options__btn--save')
            setTimeout(function () {
                status.classList = 'hidden'
            }, 1550)
        }
    )
}

function reset_messages() {
    let confirmDestroy = window.confirm('Are you sure you want to delete all msgs and websites in Stotic Focus?')

    if (confirmDestroy) {
        const deleteMsgBtn = document.getElementById('reset')
        deleteMsgBtn.remove()

        chrome.storage.sync.set(
            {
                sites: [],
            },
            function () {
                // Update status //deletes all messages //updates view
                document.querySelector('#options__popups__siteList > span').textContent = 'No Site Messages Set Yet'
                const status = document.getElementById('status')

                const msgDiv = document.getElementById('options__popups__siteList__table')
                msgDiv.remove()

                status.textContent = 'Removed all messages.'
                status.classList = ''
                setTimeout(function () {
                    status.classList = 'hidden'
                }, 1550)
            }
        )
    }
}

function delete_message(siteURL, siteDiv) {
    const confirmDestroy = window.confirm('Are you sure you want to delete this msg?')

    if (confirmDestroy) {
        chrome.storage.sync.get('sites', function (data) {
            let sites = data.sites
            let updatedSites = sites.filter((s) => s.url !== siteURL)
            chrome.storage.sync.set({ sites: updatedSites }, function () {
                siteDiv.remove()
            })
        })
    }
}

// Restores select box and checkbox state using the preferences in storage
// Displays Current Popups
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(null, function ({ options, sites }) {
        document.getElementById('timer').value = options.timer
        document.getElementById('timer').placeholder = 'Add Display Time'
        document.getElementById('timerOff').checked = options.timerOff
        document.getElementById('fullscreen').checked = options.fullscreen
        document.getElementById('closePopupBeforeTimer').checked = options.closePopupBeforeTimer
        document.getElementById('opaque').checked = options.opaque
        document.getElementById('stoicQuotes').checked = options.stoicQuotes
        document.getElementById('viewCounter').checked = options.viewCounter

        const allInputs = document.querySelectorAll('input[type="checkbox"]')
        let allInputsArray = [...allInputs]

        allInputsArray.forEach((input) => {
            input.addEventListener('change', () => {
                document.getElementById('save').classList.add('options__btn--save')
            })
        })

        let siteListContainer = document.getElementById('options__popups__siteList')
        let siteListTable = document.getElementById('options__popups__siteList__table')
        let headerText = document.createElement('span')
        headerText.classList = 'options__popups__header'
        if (sites[0]) {
            //creates delete all messages btn
            const saveBtn = document.getElementById('save')
            let deleteMsgBtn = document.createElement('button')
            deleteMsgBtn.classList = 'options__btn'
            deleteMsgBtn.setAttribute('id', 'reset')
            saveBtn.after(deleteMsgBtn)
            deleteMsgBtn.innerHTML = 'Delete All Messages'
            deleteMsgBtn.addEventListener('click', reset_messages)

            //updates title of section
            headerText.textContent = 'Your Current Popups'
            siteListContainer.prepend(headerText)

            //populates the list of current messages
            sites.forEach((site) => {
                let { dateCreated, msg, url, visits, domainLevelBlock } = site
                let siteDiv = document.createElement('div')
                siteDiv.classList = 'options__popups_sitelist__li'

                let urlDiv = document.createElement('div')
                urlDiv.textContent = url
                urlDiv.classList = 'options__popups_sitelist__li__url'

                let msgDiv = document.createElement('div')
                msgDiv.textContent = msg
                msgDiv.classList = 'options__popups_sitelist__li__msg no-margin-top'

                let visitsDiv = document.createElement('div')
                visitsDiv.textContent = `visits: ${visits}`

                let domainLvlDiv = document.createElement('div')
                domainLvlDiv.textContent = `${domainLevelBlock ? 'domain lvl' : 'site lvl'}`

                let dateCreatedDiv = document.createElement('div')
                dateCreatedDiv.textContent = formatDate(dateCreated)

                let deleteBtn = document.createElement('button')
                deleteBtn.textContent = 'Delete'
                deleteBtn.classList = 'no-margin-top small-margin-bottom'
                deleteBtn.addEventListener('click', () => delete_message(url, siteDiv))

                siteDiv.appendChild(urlDiv)
                siteDiv.appendChild(msgDiv)
                siteDiv.appendChild(visitsDiv)
                siteDiv.appendChild(domainLvlDiv)
                siteDiv.appendChild(dateCreatedDiv)
                siteDiv.appendChild(deleteBtn)
                siteListTable.appendChild(siteDiv)
            })
        } else {
            //resets title
            headerText.textContent = 'No Sites Messages Set Yet'
            siteListContainer.appendChild(headerText)
        }
    })
}

document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('save').addEventListener('click', save_options)
