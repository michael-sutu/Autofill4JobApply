function fill(element) {
    let elementType = element.nodeName.toLowerCase()
    let labels = []
    element.labels.forEach((label) => {
        labels.push(label.textContent)
    })

    let elementData = {
        "type": elementType,
        "labels": labels
    }

    if(elementType == "input") {
        elementData.placeholder = element.placeholder
        elementData.inputType = element.type
        elementData.value = element.value
    } else if(elementType == "select") {
        let options = []
        element.options.forEach((option) => {
            options.push(option.textContent)
        })
        elementData.options = options
    } else if(elementType == "textarea") {
        elementData.placeholder = element.placeholder
        elementData.value = element.value
    }

    console.log(elementData)
}

// Idea: For values that do not have a question directly linked, start from the element and then move up in the DOM looking for elements with text-content.

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "startAutofill") {
        let searchFor = ["input", "textarea", "select"]
        for(let i = 0; i < searchFor.length; i++) {
            document.querySelectorAll(searchFor[i]).forEach((element) => {
                fill(element)
            })
        }
    }
})