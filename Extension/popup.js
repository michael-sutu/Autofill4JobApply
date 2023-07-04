document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.sync.get(["userid"], function(items){
        if(items.userid) {
            document.getElementById("auth").style.display = "block"
        } else {
            document.getElementById("noauth").style.display = "block"
        }
    })

    let autofillBtn = document.getElementById("autofillBtn")
    autofillBtn.addEventListener("click", function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "startAutofill" })
            autofillBtn.remove()
            document.getElementById("dashboardBtn").remove()
            document.querySelector("h2").style.display = "block"
            let i = 0
            let dotInterval = setInterval((e) => {
                i += 1
                if(i == 4) {
                    i = 0
                }

                document.querySelector("h2").textContent = "Autofilling"
                for(let x = 0; x < i; x++) {
                    document.querySelector("h2").textContent += "."
                }
            }, 300)

            chrome.runtime.onMessage.addListener(
                function(request, sender, sendResponse) {
                    if (request.msg === "stopAutofill") {
                        clearInterval(dotInterval)
                        document.querySelector("h2").textContent = `Filled ${request.data.filled+"/"+request.data.total} feilds.`
                    }
                }
            )
        })
    })

    document.getElementById("dashboardBtn").addEventListener("click", (e) => {
        window.open("http://localhost:3000")
    })

    document.getElementById("submitBtn").addEventListener("click", (e) => {
        fetch("http://localhost:3000/api/authPlugin?userid="+document.querySelector("input").value)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if(data == null) {
                    document.querySelector("input").placeholder = "Unknown userid"
                    document.querySelector("input").style.borderColor = "red"
                    document.querySelector("input").value = ""
                    document.querySelector("input").className = "badInput"
                } else {
                    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "setUserid-"+data.userid })
                    })
                    document.getElementById("noauth").style.display = "none"
                    document.getElementById("auth").style.display = "block"
                }
            })
    })

    document.querySelector("a").addEventListener("click", (e) => {
        window.open("http://localhost:3000")
    })
})  