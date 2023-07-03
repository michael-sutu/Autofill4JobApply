console.log("Autofill4JobApply is ready.")

function nearby(element) {
    let final = []
  
    let siblings = element.parentElement.children
  
    while (siblings.length > 0 && final.length === 0) {
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].textContent.trim().length > 0) {
            final.push(siblings[i].textContent)
        }
      }
  
      if(final.length == 0) {
        siblings = siblings[0].parentElement.parentElement.children
      }
    }

    return final
}
  

function fill(element) {
    let elementType = element.nodeName.toLowerCase()
    let labels = []
    element.labels.forEach((label) => {
        labels.push(label.textContent)
    })

    let elementData = {
        "type": elementType,
        "labels": labels,
        "nearby": nearby(element)
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