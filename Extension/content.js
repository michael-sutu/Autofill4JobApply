function compress(text) {
    if(text == undefined) {
        return undefined
    }
    return text.trim().replaceAll("?", "").toLowerCase().replaceAll(" ", "")
}
 
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

function shrink(info) {
    let final = []
    for(let i = 0; i < info.length; i++) {
        let value = info[i].Values[0]
        let queries = [compress(info[i].Question)]
        for(let x = 0; x < info[i].Alternatives.length; x++) {
            queries.push(compress(info[i].Alternatives[x]))
        }
        final.push({"queries": queries, "value": value})
    }
    return final
}

function fill(element, info) {
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

    for(let i = 0; i < info.length; i++) {
        for(let x = 0; x < info[i].queries.length; x++) {
            if(compress(elementData.labels[0]) == info[i].queries[x]) {
                element.value = info[i].value
                return 1
            } else {
                if(compress(elementData.nearby[0]) == info[i].queries[x]) {
                    element.value = info[i].value
                    return 1
                } else {
                    if(elementData.placeholder != undefined) {
                        if(compress(elementData.placeholder) == info[i].queries[x]) {
                            element.value = info[i].value
                            return 1
                        }
                    }
                }
            }
        }
    }
    
    fetch(`http://localhost:3000/api/unknown?data=${JSON.stringify(elementData)}`)
    return 0
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "startAutofill") {
        chrome.storage.sync.get(["userid"], function(items) {
            if(items.userid) {
                fetch("http://localhost:3000/api/authPlugin?userid="+items.userid)
                    .then(response => response.json())
                    .then(data => {
                        let searchFor = ["input", "textarea", "select"]
                        let total = 0
                        let filled = 0
                        for(let i = 0; i < searchFor.length; i++) {
                            document.querySelectorAll(searchFor[i]).forEach((element) => {
                                filled += fill(element, shrink(data.Info))
                                total += 1
                            })
                        }
                        chrome.runtime.sendMessage({
                            msg: "stopAutofill", 
                            data: {
                                filled: filled,
                                total: total
                            }
                        })
                    })
            }
        })
    } else if(request.action.split("-")[0] == "setUserid") {
        chrome.storage.sync.set({ "userid": request.action.split("-")[1] }, function(){
            console.log(request.action.split("-")[1])
        })
    }
})