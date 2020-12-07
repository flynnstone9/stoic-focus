//runs on client every page load

//listens for matching sites on chrome side // changes page for 5 seconds w message
chrome.runtime.onMessage.addListener(async (req, sender, sendRes) => {
    
    let msgTime = 10
    // console.log(req, 'this is the req from chrome side')
    let body = document.querySelector('body')

    let msgDiv = document.createElement('div')
    msgDiv.classList = "content_stoicFocus"

    
    let imgDiv = document.createElement('div')
    imgDiv.style.display = 'flex'

    let img = document.createElement('img')
    img.src = chrome.runtime.getURL("images/stoic128.png")
    img.width = '128'
    img.height = '128'

    let trianlgeDiv = document.createElement('div')
    trianlgeDiv.classList = 'triangle-left'

    imgDiv.appendChild(img)
    imgDiv.appendChild(trianlgeDiv)

    let msgInnerDiv = document.createElement('div')
    msgInnerDiv.classList = "content_stoicFocus__msgInner"


    let mainContentDiv = document.createElement('div')

    mainContentDiv.classList = "content_stoicFocus__contentDiv"
    mainContentDiv.appendChild(imgDiv)
    mainContentDiv.innerHTML += `<div class="content__sf__txt">
                                <div class="content__sf__txt__msg">${req.msg}</div>
                                <div class="content__sf__txt__site">${req.url}</div>
                            </div>`


    
    
    

    mainContentDiv.innerHTML += `<div class="content__sf__counterDiv">
                                    <div class="content__sf__counterDiv__visits">
                                        <div class="content__sf__counterDiv__visits_num">${req.visits}</div>
                                        <div class="content__sf__counterDiv__visits_text"># of visits</div>
                                    </div>
                                    <div class="content__sf__counterDiv__date">
                                        <div class="content__sf__counterDiv__date__text">
                                        <span class="content__sf__counterDiv__date__date">${formatDate(req.dateCreated)}</span>
                                        </div>
                                    </div>
                                </div>`

    msgInnerDiv.appendChild(mainContentDiv)

    let timerDiv = document.createElement('div')
    timerDiv.id = 'content__sf__timer'
    timerDiv.classList = 'content__sf__timer'

    let timer = setInterval(myTimer, 1000);
    function myTimer() {
        if (msgTime <= 0) {
            clearInterval(timer);
        }
        document.getElementById("content__sf__timer").innerHTML = `Disappearing in <span class="content__sf__timer__time">${msgTime}seconds</span>`
        msgTime--
      }

    
      
    msgInnerDiv.appendChild(timerDiv)
    msgDiv.appendChild(msgInnerDiv)
    body.prepend(msgDiv)
    

    setTimeout(() => {
        msgDiv.classList.add("content_stoicFocus__hidden")
        // msgDiv.style.display = 'none'
    }, msgTime*1000)

})


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [month, day, year].join('/');
}