document.addEventListener("DOMContentLoaded", function() {
    let autofillBtn = document.getElementById("autofillBtn")
    autofillBtn.addEventListener("click", function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "startAutofill" })
        })
    })
})  