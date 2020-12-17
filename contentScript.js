//runs on client every page load
//listens for matching sites on chrome side // changes page for 10 seconds w message if match
chrome.runtime.onMessage.addListener(async (req, sender, sendRes) => {
    let alreadyLoaded = document.getElementsByClassName('content_stoicFocus')[0]
    if (alreadyLoaded) {
        return
    }

    let { updatedSite, browser } = req

    let body = document.querySelector('body')

    let msgDiv = document.createElement('div')
    msgDiv.classList = 'content_stoicFocus'

    let imgDiv = document.createElement('div')
    imgDiv.style.display = 'flex'

    let img = document.createElement('img')
    img.src = chrome.runtime.getURL('images/stoic128.png')
    img.width = '128'
    img.height = '128'
    img.classList = 'content_stoicfocus_img'
    img.setAttribute('alt', 'stoic focus logo')

    let trianlgeDiv = document.createElement('div')
    trianlgeDiv.classList = 'triangle-left'

    imgDiv.appendChild(img)
    imgDiv.appendChild(trianlgeDiv)

    let msgInnerDiv = document.createElement('div')
    msgInnerDiv.classList = 'content_stoicFocus__msgInner'

    let mainContentDiv = document.createElement('div')

    mainContentDiv.classList = 'content_stoicFocus__contentDiv'
    mainContentDiv.appendChild(imgDiv)

    let mainTextDiv = document.createElement('div')
    mainTextDiv.classList = 'content__sf__txt'
    let mainTextDivTxtMsg = document.createElement('div')
    mainTextDivTxtMsg.classList = 'content__sf__txt__msg'
    mainTextDivTxtMsg.textContent = `${updatedSite.msg}`
    let mainTextDivTxtSite = document.createElement('div')
    mainTextDivTxtSite.classList = 'content__sf__txt__site'
    mainTextDivTxtSite.textContent = `${updatedSite.url}`
    mainTextDiv.appendChild(mainTextDivTxtMsg)
    mainTextDiv.appendChild(mainTextDivTxtSite)
    mainContentDiv.appendChild(mainTextDiv)

    if (browser !== 'Firefox') {
        let counterDiv = document.createElement('div')
        counterDiv.classList = 'content__sf__counterDiv'

        let counterDivVisits = document.createElement('div')
        counterDivVisits.classList = 'content__sf__counterDiv__visits'
        let counterDivVisitsNum = document.createElement('div')
        counterDivVisitsNum.classList = 'content__sf__counterDiv__visits_num'
        counterDivVisitsNum.textContent = `${updatedSite.visits}`
        let counterDivVisitsText = document.createElement('div')
        counterDivVisitsText.classList = 'content__sf__counterDiv__visits_text'
        counterDivVisitsText.textContent = `# of visits since`
        counterDivVisits.appendChild(counterDivVisitsNum)
        counterDivVisits.appendChild(counterDivVisitsText)

        let counterDivDate = document.createElement('div')
        counterDivDate.classList = 'content__sf__counterDiv__date'
        let counterDivDateText = document.createElement('div')
        counterDivDateText.classList = 'content__sf__counterDiv__date__text'
        let counterDivDateDate = document.createElement('span')
        counterDivDateDate.classList = 'content__sf__counterDiv__date__date'
        counterDivDateDate.textContent = `${formatDate(updatedSite.dateCreated)}`
        counterDivDateText.appendChild(counterDivDateDate)
        counterDivDate.appendChild(counterDivDateText)

        counterDiv.appendChild(counterDivVisits)
        counterDiv.appendChild(counterDivDate)
        mainContentDiv.appendChild(counterDiv)
    }

    msgInnerDiv.appendChild(mainContentDiv)

    let timerDiv = document.createElement('div')
    timerDiv.id = 'content__sf__timer'
    timerDiv.classList = 'content__sf__timer'

    let msgTime = 10
    let timer = setInterval(myTimer, 1000)
    function myTimer() {
        if (msgTime <= 0) {
            clearInterval(timer)
        }

        let timerElement = document.getElementsByClassName('content__sf__timer')[0]
        timerElement.textContent = 'Disappearing in '
        let timerSpan = document.createElement('span')
        timerSpan.classList = 'content__sf__timer__time'
        timerSpan.textContent = `${msgTime} seconds`
        timerElement.appendChild(timerSpan)

        msgTime--
    }

    let closeBtn = document.createElement('button')
    closeBtn.innerHTML = '[X]'
    closeBtn.classList = 'close__btn'

    closeBtn.onclick = function (e) {
        e.preventDefault()
        msgDiv.style.display = 'none'
    }

    let footerDiv = document.createElement('div')
    footerDiv.classList = 'footer__div'

    footerDiv.appendChild(closeBtn)
    footerDiv.appendChild(timerDiv)
    msgInnerDiv.appendChild(footerDiv)

    msgDiv.appendChild(msgInnerDiv)
    body.prepend(msgDiv)

    setTimeout(() => {
        msgDiv.classList.add('content_stoicFocus__hidden')
        setTimeout(() => {
            msgDiv.style.display = 'none'
        }, 2000)
    }, msgTime * 1000)
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
