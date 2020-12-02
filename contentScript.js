//runs on client every page load
// console.log('heyeyeyey ohhhoeoeohoh')


//listens for matching sites on chrome side // changes page for 5 seconds w message
chrome.runtime.onMessage.addListener(async (req, sender, sendRes) => {

    // console.log(req, 'this is the req from chrome side')
    let body = document.querySelector('body')

    let msgDiv = document.createElement('div')
    msgDiv.style.display = 'flex'
    msgDiv.style.margin = '0 auto'
    msgDiv.style.background = '#333'
    msgDiv.style.color = 'white'

    msgDiv.innerHTML = `<div style="color:gold;font-size:2rem;margin:auto; padding:100px"><div>${req.msg}</div>
        <div style="color:red;font-size:1.2rem;opacity: 0.8;margin-top: 10px">${req.url}</div></div>`

    body.prepend(msgDiv)

    setTimeout(() => {
        msgDiv.style.display = 'none'
    }, 5000)

})