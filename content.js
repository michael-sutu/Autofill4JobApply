chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "startAutofill") {
        const html = document.documentElement.outerHTML
        console.log(html)
    }
})