chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("message received")
    if (request.action === "startAutofill") {
        const html = document.documentElement.outerHTML
        console.log(html)
    }
})