document.addEventListener("DOMContentLoaded", function() {
    let autofillBtn = document.getElementById("autofillBtn")
    autofillBtn.addEventListener("click", function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "startAutofill" })
            autofillBtn.remove()
            document.querySelector("h2").style.display = "block"
            let i = 0
            setInterval((e) => {
                i += 1
                if(i == 4) {
                    i = 0
                }

                document.querySelector("h2").textContent = "Autofilling"
                for(let x = 0; x < i; x++) {
                    document.querySelector("h2").textContent += "."
                }
            }, 300)
        })
    })
})  