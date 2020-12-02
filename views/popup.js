let siteInfo = document.getElementById('siteInfo')
let isCurrentSiteAlreadyAdded = false


chrome.tabs.getSelected(null,function(tab) {
    let tablink = tab.url;
    // console.log(tab, tablink, 'tablink')

    //set ui based on if msg set for site already
    chrome.storage.sync.get('sites', function(data) {
        let sites = data.sites
        let isCurrentSiteAlreadyAdded
        
        for (let i=0; i < sites.length; i++) {
            let {url, msg} = sites[i]
            if (tablink.includes(url)) {
                let exsistingSiteText = document.createElement('div')
                exsistingSiteText.innerHTML = `<div class="active">active: ${url}</div><div>current msg: ${msg}</div>`
                siteInfo.appendChild(exsistingSiteText)
                isCurrentSiteAlreadyAdded = true
                return
            } 
        }

        if (!isCurrentSiteAlreadyAdded) {
            let exsistingSiteText = document.createElement('div')
            exsistingSiteText.innerHTML = `<div class="notactive">not active: ${tablink}</div><br>`
            
            let inputDiv = document.createElement('div')
            inputDiv.innerHTML = `<div>add site msg<br></div>`

            let input = document.createElement('input')
            input.setAttribute("type", "text")
            input.setAttribute("id", "sitemsg")
            input.setAttribute("name", "sitemsg")

            let submitBtn = document.createElement('button')
            submitBtn.innerText = 'add site'
            submitBtn.onclick = function(e) {
                e.preventDefault()
                console.log('hey', e.target, input.value)
                
                let newSite = {
                    msg: input.value,
                    url: tablink
                }

                sites.push(newSite)
                console.log(sites, 'sites with new one')

                chrome.storage.sync.set({
                    'sites': sites
                }, function() {
                    console.log('Value is set to ' + sites);
                });

                
            }

            inputDiv.appendChild(input)
            inputDiv.appendChild(submitBtn)
            exsistingSiteText.appendChild(inputDiv)
            siteInfo.appendChild(exsistingSiteText)
            console.log('site is not already active')
        }
    });

});