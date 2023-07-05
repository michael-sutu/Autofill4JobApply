function compress(text) { // takes in a string then returns the same string with no spaces, question marks, *, and all lowercase.
    if(text == undefined) {
        return undefined
    }
    return text.trim().replaceAll("?", "").toLowerCase().replaceAll(" ", "").replaceAll("*", "")
}
 
function nearby(element) {
    let final = []
  
    let siblings = element.parentElement.children
  
    while (siblings.length > 0 && final.length === 0) { // goes through all the elements that are at the same level and checks for textContent
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].textContent.trim().length > 0) {
            final.push(siblings[i].textContent)
        }
      }
  
      if(final.length == 0) { // if none are found move up to the parent nodes level
        siblings = siblings[0].parentElement.parentElement.children
      }
    }

    return final
}

function shrink(info) { // takes in user info and gets rid of the information that is not needed aswell as compressing those strings to make it easier to match
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

function fill(element, info, changeValue) { 
    try {
        // creates an object for the element and fills out all known values to later be used to fill out or to save
        let elementType = element.nodeName.toLowerCase()
        let labelList = []
        if(element.labels) {
            element.labels.forEach((label) => {
                labelList.push(label.textContent)
            })
        }
    
        let elementData = {
            "type": elementType,
            "labels": labelList,
            "nearby": nearby(element)
        }

        if(elementType == "input") {
            elementData.placeholder = element.placeholder
            elementData.inputType = element.type
            elementData.value = element.value
        } else if(elementType == "select") {
            let options = []
            if(element.options) {
                for(let o = 0; o < element.options.length; o++) {
                    options.push(element.options[o].textContent)
                }
            }
            elementData.options = options
        } else if(elementType == "textarea") {
            elementData.placeholder = element.placeholder
            elementData.value = element.value
        }

        if(changeValue) { // fills out the elements based off of elementData
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
        
            // saves elementData to unknown queries
            //fetch(`http://localhost:3000/api/unknown?data=${JSON.stringify(elementData)}`)
            return 0
        } else { // just returns elementData for the save feature
            return elementData
        }
    } catch(error) {
        console.log(error)
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "startAutofill") { // to start autofilling in feilds
        chrome.storage.sync.get(["userid"], function(items) { 
            if(items.userid) {
                fetch("http://localhost:3000/api/authPlugin?userid="+items.userid) // gets the userinformation
                    .then(response => response.json())
                    .then(data => {
                        let searchFor = ["input", "textarea", "select"]
                        let total = 0
                        let filled = 0

                        if(document.getElementById("input-7")) {
                            document.getElementById("input-7").click()
                        }

                        for(let i = 0; i < searchFor.length; i++) { // goes through all inputs, textareas, and selects on the screen to try to fill out
                            document.querySelectorAll(searchFor[i]).forEach((element) => {
                                filled += fill(element, shrink(data.Info), true)
                                total += 1
                            })
                        }

                        let state = ""
                        let start = ""
                        let end = ""
                        let degree = ""
                        let gender = ""
                        let HorL = ""
                        let ethnicity = ""
                        let veteran = ""
                        for(let i = 0; i < data.Info.length; i++) { // gets special cases for certain elements on webpages
                            if(data.Info[i].Question == "State") {
                                state = data.Info[i].Values[0]
                            } else if(data.Info[i].Question == "Start Work Month") {
                                start = data.Info[i].Values[0]
                            } else if(data.Info[i].Question == "End Work Month") {
                                end = data.Info[i].Values[0]
                            } else if(data.Info[i].Question == "Degree") {
                                degree = data.Info[i].Values[0]
                            } else if(data.Info[i].Question == "Gender") {
                                gender = data.Info[i].Values[0]
                            } else if(data.Info[i].Question == "Hispanic or Latino") {
                                HorL = data.Info[i].Values[0]
                            } else if(data.Info[i].Question == "Ethnicity") {
                                ethnicity = data.Info[i].Values[0]
                            } else if(data.Info[i].Question == "Veteran") {
                                veteran = data.Info[i].Values[0]
                            }
                        }

                        document.querySelectorAll("div").forEach((e) => {
                            if(compress(e.textContent) == compress(state)) {
                                e.click()
                                filled += 1
                            }
                        })

                        // looks for specfic inputs and filling those with the other inputs that were defined earlier
                        let r = 0
                        if(document.querySelector(".css-hdh0bo")) {
                            document.querySelectorAll(".css-hdh0bo").forEach((e) => {
                                e.click()
                                document.querySelectorAll("label").forEach((e) => {
                                    if(r == 0) {
                                        if(compress(e.textContent) == compress(start)) {
                                            e.click()
                                            filled += 1
                                        }
                                    } else if(r == 1) {
                                        if(compress(e.textContent) == compress(end)) {
                                            e.click()
                                            filled += 1
                                        }
                                    }
                                })
                                r += 1
                            })
                        }
                        
                        if(document.getElementById("input-37")) {
                            document.getElementById("input-37").click()
                            document.querySelectorAll("div").forEach((e) => {
                                if(compress(e.textContent) == compress(degree)) {
                                    e.click()
                                    filled += 1
                                }
                            })
                        }

                        if(document.getElementById("input-117")) {
                            document.getElementById("input-117").click()
                            document.querySelectorAll("div").forEach((e) => {
                                if(compress(e.textContent) == "yes") {
                                    e.click()
                                    filled += 1
                                }
                            })
                        }

                        if(document.getElementById("input-122")) {
                            document.getElementById("input-122").click()
                            document.querySelectorAll("div").forEach((e) => {
                                if(compress(e.textContent) == compress(gender)) {
                                    e.click()
                                    filled += 1
                                }
                            })
                        }

                        if(document.getElementById("input-123")) {
                            document.getElementById("input-123").click()
                            document.querySelectorAll("div").forEach((e) => {
                                if(compress(e.textContent) == compress(HorL)) {
                                    e.click()
                                    filled += 1
                                }
                            })
                        }

                        if(document.getElementById("input-124")) {
                            document.getElementById("input-124").click()
                            document.querySelectorAll("div").forEach((e) => {
                                if(compress(e.textContent) == compress(ethnicity)) {
                                    e.click()
                                    filled += 1
                                }
                            })
                        }

                        if(document.getElementById("input-125")) {
                            document.getElementById("input-125").click()
                            document.querySelectorAll("div").forEach((e) => {
                                if(compress(e.textContent) == compress(veteran)) {
                                    e.click()
                                    filled += 1
                                }
                            })
                        }

                        chrome.runtime.sendMessage({ // sends the message back to stock autofilling
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
    } else if(request.action == "startSave") { // to start saving filled in feilds
        let searchFor = ["input", "textarea", "select"]
        let total = 0
        let filled = 0
        let results = []

        for(let i = 0; i < searchFor.length; i++) { // gets all the feilds
            document.querySelectorAll(searchFor[i]).forEach((element) => {
                results.push(fill(element, [], false))
                total += 1
            })
        }

        let newResults = []
        for(let i = 0; i < results.length; i++) { // gets all the filled in feilds
            if(results[i].value != "" && results[i].inputType != "radio" && results[i].labels.length > 0) {
                newResults.push({"question": results[i].labels[0], "tag": results[i].type, "type": results[i].inputType, "value": results[i].value})
            }
        }

        chrome.storage.sync.get(["userid"], function(items) { // saves the results to that userid
            fetch("http://localhost:3000/api/saveResults?data="+JSON.stringify(newResults)+"&userid="+items.userid)
                .then(response => response.json())
                .then(data => {
                    chrome.runtime.sendMessage({
                        msg: "doneSaving", 
                        data: {
                            filled: newResults.length,
                            total: total
                        }
                    })
                })
        })
    }
})