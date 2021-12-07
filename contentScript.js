//runs on client every page load
//listens for matching sites on chrome side // changes page for 10 seconds w message if match
chrome.runtime.onMessage.addListener(async (req, sender, sendRes) => {
    let alreadyLoaded = document.getElementsByClassName('content_stoicFocus')[0]
    if (alreadyLoaded) {
        return
    }

    let { updatedSite, browser, options } = req

    let body = document.querySelector('body')

    let msgDiv = document.createElement('div')
    msgDiv.classList = 'content_stoicFocus'

    if (options.opaque) {
        msgDiv.classList.add('content_stoicFocus--opaque')
    }

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

    if (options.stoicQuote) {
        let stoicQuoteDiv = document.createElement('div')
        stoicQuoteDiv.classList = 'content__sf__stoicquote__div'
        let stoicQuote = document.createElement('p')
        stoicQuote.classList = 'content__sf__stoicquote__quote'
        stoicQuote.textContent = `"${getRandomQuote()}"`
        stoicQuoteDiv.appendChild(stoicQuote)
        mainTextDiv.appendChild(stoicQuoteDiv)
    }

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

    let msgTime = options.timer
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

    let footerDiv = document.createElement('div')
    footerDiv.classList = 'footer__div'

    if (options.closePopupBeforeTimer) {
        let closeBtn = document.createElement('button')
        closeBtn.innerHTML = '[X]'
        closeBtn.classList = 'close__btn'

        closeBtn.onclick = function (e) {
            e.preventDefault()
            msgDiv.style.display = 'none'
        }

        footerDiv.appendChild(closeBtn)
    }

    if (options.fullscreen) {
        msgDiv.classList += ' content_stoicFocus__Fullscreen'
        footerDiv.classList += ' footer__div__Fullscreen'
    }

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

let quotes = [
    'We will learn that though we think big, we must act and live small in order to accomplish what we seek.',
    'Those who can tell you in great detail who they intend to become and when they intend to achieve it They can tell you all the things they’re going to do, or have even begun, but they cannot show you their progress. Because there rarely is any.',
    'Plato spoke of the type of people who are guilty of feasting on their own thoughts. They assume that what they desire is available and proceed to arrange the rest,taking pleasure in thinking through everything they’ll do when they have what they want, thereby making their lazy souls even lazier.',
    'You have power over your mind - not outside events. Realize this, and you will find strength.',
    'The happiness of your life depends upon the quality of your thoughts',
    'Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth',
    'If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment',
    'Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.',
    'I have often wondered how it is that every man loves himself more than all the rest of men, but yet sets less value on his own opinion of himself than on the opinion of others.',
    'Begin each day by telling yourself: Today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness – all of them due to the offenders’ ignorance of what is good or evil.',
    'You act like mortals in all that you fear, and like immortals in all that you desire',
    'It is not that we have so little time but that we lose so much. ... The life we receive is not short but we make it so; we are not ill provided but use what we have wastefully',
    'They lose the day in expectation of the night, and the night in fear of the dawn.',
    'Often a very old man has no other proof of his long life than his age.',
    'If you really want to escape the things that harass you, what you’re needing is not to be in a different place but to be a different person.',
    "Until we have begun to go without them, we fail to realize how unnecessary many things are. We've been using them not because we needed them but because we had them",
    'For many men, the acquisition of wealth does not end their troubles, it only changes them',
    'People are not disturbed by things, but by the views they take of them',
    'These reasonings do not cohere: I am richer than you, therefore I am better than you; I am more eloquent than you, therefore I am better than you. On the contrary these rather cohere, I am richer than you, therefore my possessions are greater than yours: I am more eloquent than you, therefore my speech is superior to yours. But you are neither possession nor speech.',
    'Remember that you must behave as at a banquet. Is anything brought round to you? Put out your hand, and take a moderate share. Does it pass you? Do not stop it. Is it not come yet? Do not yearn in desire towards it, but wait till it reaches you.',
    'Demand not that events should happen as you wish; but wish them to happen as they do happen, and you will go on well.',
    'Disease is an impediment to the body, but not to the will',
    'for your part, do not desire to be a general, or a senator, or a consul, but to be free; and the only way to this is a disregard of things which lie not within our own power',
    'When we are no longer able to change a situation, we are challenged to change ourselves',
    'Everything can be taken from a man but one thing: the last of the human freedoms—to choose one’s attitude in any given set of circumstances, to choose one’s own way.',
    "Those who have a 'why' to live, can bear with almost any 'how'",
    'the easiest way for us to gain happiness is to learn how to want the things we already have',
    'There is a difference between contemplating something bad happening and worrying about it. Contemplation is an intellectual exercise. Conduct such exercises without affecting your emotions.',
    'Do not over-love the things you enjoy. Be the user, but not the slave, of the gifts of fortune.',
    "If you periodically embrace discomfort, you're more likely to be comfortable than someone who tries to avoid all discomfort. You'll have a much wider comfort zone than others and will therefore feel comfortable under circumstances that would cause others distress.",
    'Retrospective negative visualization: imagine never having had something that you have lost. By engaging in retrospective negative visualization, you can replace your feelings of regret at having lost something with feelings of thanks for once having had it.',
    'Fear is a natural reaction to moving closer to the truth',
    'The most fundamental aggression to ourselves, the most fundamental harm we can do to ourselves, is to remain ignorant by not having the courage and the respect to look at ourselves honestly and gently.',
    'The most difficult times for many of us are the ones we give ourselves.',
    'Rather than letting our negativity get the better of us, we could acknowledge that right now we feel like a piece of shit and not be squeamish about taking a good look.',
    'For the Stoics, then, our judgments about the world are all that we can control, but also all that we need to control in order to be happy; tranquility results from replacing our irrational judgments with rational ones',
    'Confronting the worst-case scenario saps it of much of its anxiety-inducing power. Happiness reached via positive thinking can be fleeting and brittle, negative visualization generates a vastly more dependable calm.',
    "And here lies the essential between Stoicism and the modern-day 'cult of optimism.' For the Stoics, the ideal state of mind was tranquility, not the excitable cheer that positive thinkers usually seem to mean when they use the word, 'happiness.' And tranquility was to be achieved not by strenuously chasing after enjoyable experiences, but by cultivating a kind of calm indifference towards one's circumstances.",
    'True security lies in the unrestrained embrace of insecurity - in the recognition that we never really stand on solid ground, and never can.',
    'For the Stoics, then, our judgments about the world are all that we can control, but also all that we need to control in order to be happy; tranquility results from replacing our irrational judgments with rational ones',
    'The effort to feel happy is often precisely the thing that makes us miserable. And that it is out constant efforts to eliminate the negative - insecurity, uncertainty, failure, or sadness - that is what causes us to feel so insecure, anxious, uncertain, or unhappy',
    'Antifragility is beyond resilience or robustness. The resilient resists shocks and stays the same; the antifragile gets better.',
    'My idea of the modern Stoic sage is someone who transforms fear into prudence, pain into information, mistakes into initiation, and desire into undertaking.',
    'The antifragile loves randomness and uncertainty, which also means—crucially—a love of errors, a certain class of errors. Antifragility has a singular property of allowing us to deal with the unknown, to do things without understanding them—and do them well.',
    'Just because your mind tells you that something is awful or evil or unplanned or otherwise negative doesn’t mean you have to agree. Just because other people say that something is hopeless or crazy or broken to pieces doesn’t mean it is. We decide what story to tell ourselves.',
    'There is no good or bad without us, there is only perception. There is the event itself and the story we tell ourselves about what it means.',
    'Just because your mind tells you that something is awful or evil or unplanned or otherwise negative doesn’t mean you have to agree. Just because other people say that something is hopeless or crazy or broken to pieces doesn’t mean it is. We decide what story to tell ourselves',
    'Think progress, not perfection',
    'The obstacle in the path becomes the path. Never forget, within every obstacle is an opportunity to improve our condition.',
    'The only guarantee, ever, is that things will go wrong. The only thing we can use to mitigate this is anticipation. Because the only variable we control completely is ourselves.',
    'In every situation, life is asking us a question, and our actions are the answer.',
    'This is the most simple and basic component of life: our struggles determine our successes.',
    'Our crisis is no longer material; it’s existential, it’s spiritual. We have so much fucking stuff and so many opportunities that we don’t even know what to give a fuck about anymore.',
    'The more something threatens your identity, the more you will avoid it.',
    'To be happy we need something to solve. Happiness is therefore a form of action;',
    'Don’t just sit there. Do something. The answers will follow',
    'It turns out that adversity and failure are actually useful and even necessary for developing strong-minded and successful adults.',
    'It’s part of being human to feel discomfort. We don’t even have to call it suffering.',
    'Resisting life causes suffering. The cessation of suffering is letting go of holding on to ourselves.',
    'Opting for coziness, having that as your prime reason for existing, becomes a continual obstacle to taking a leap and doing something new, doing something unusual, like going as a stranger into a strange land.',
    'Life is difficult. This is a great truth, one of the greatest truths. It is a great truth because once we truly see this truth, we transcend it. Once we truly know that life is difficult-once we truly understand and accept it-then life is no longer difficult. Because once it is accepted, the fact that life is difficult no longer matters.',
    'Discipline is the basic set of tools we require to solve life’s problems. Without discipline we can solve nothing. With total discipline we can solve all problems.',
    'Most of us attempt to avoid problems. This tendency is the primary basis of all human mental illness.',
]

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)]
}
