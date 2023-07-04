function makeid(length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return result
}

let navButtons = document.querySelector(".sidenav").children
for(let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", (e) => {
        button = e.target
        if(e.target.textContent == "Information") {
            location.reload()
        }

        if(button.className != "selected") {
            document.querySelector(`.${document.querySelector(".selected").textContent.toLowerCase()}Div`).style.display = "none"
            document.querySelector(".selected").className = ""
            button.className = "selected"
            document.querySelector(`.${button.textContent.toLowerCase()}Div`).style.display = "block"
        }
    })
}

if(localStorage.getItem("userid")) {
    document.querySelector("h2").textContent = "Your userid is "+localStorage.getItem("userid")
} else {
    let newid = makeid(15)
    localStorage.setItem("userid", newid)
    document.querySelector("h2").textContent = "Your userid is "+localStorage.getItem("userid")
    fetch("/api/new?userid="+localStorage.getItem("userid"))
}

document.getElementById("addBtn").addEventListener("click", (e) => {
    document.querySelector(".addDiv").style.display = "block"
})

let options = []
let alternatives = []
let feilds = []
document.getElementById("cancelAddBtn").addEventListener("click", (e) => {
    feilds = []
    options = []
    document.getElementById("optionsDisplay").textContent = "Options: "+JSON.stringify(options)
    document.getElementById("optionInput").value = ""
    alternatives = []
    document.getElementById("alternativesList").textContent = "Alternatives: "+JSON.stringify(alternatives)
    document.getElementById("alternativesInput").value = ""
    document.getElementById("questionInput").value = ""
    document.querySelector(".elementTag").value = "Feild Element Tag"
    document.querySelector(".inputsDiv").style.borderWidth = "0px"
    let children = Array.from(document.querySelector(".inputsDiv").children)
    for(let i = 0; i < children.length; i++) {
        children[i].remove()
    }
    document.querySelector(".inputType").style.display = "none"
    document.querySelectorAll(".option").forEach((e) => {
        e.style.display = "none"
    })
    document.querySelector(".label").style.display = "none"
    document.querySelector(".label").value = ""
    document.querySelector(".inputType").value = "Input Type"
    document.getElementById("addFeildBtn").style.display = "none"
    document.querySelector(".addDiv").style.display = "none"
})

document.querySelector(".elementTag").addEventListener("change", (e) => {
    document.querySelector(".label").style.display = "none"
    document.querySelector(".label").value = ""
    document.querySelector(".inputType").value = "Input Type"
    document.getElementById("addFeildBtn").style.display = "block"
    options = []
    document.getElementById("optionsDisplay").textContent = "Options: "+JSON.stringify(options)

    document.querySelectorAll(".option").forEach((e) => {
        if(e.nodeName == "INPUT") {
            e.value = ""
        } else if(e.nodeName == "P") {
            e.textContent = "Options: "
        }
    })

    if(e.target.value == "<input>") {
        document.querySelector(".inputType").style.display = "inline-block"
        document.querySelectorAll(".option").forEach((e) => {
            e.style.display = "none"
        })
    } else if(e.target.value == "<select>") {
        document.querySelector(".inputType").style.display = "none"
        document.querySelectorAll(".option").forEach((e) => {
            e.style.display = "inline-block"
            if(e.nodeName == "P") {
                e.style.display = "block"
            }
        })
    } else if(e.target.value == "<textarea>") {
        document.querySelector(".inputType").style.display = "none"
        document.querySelectorAll(".option").forEach((e) => {
            e.style.display = "none"
        })
    }
})

document.querySelector(".inputType").addEventListener("change", (e) => {
    document.querySelector(".label").style.display = "none"
    if(e.target.value == "radio" || e.target.value == "checkbox") {
        document.querySelector(".label").style.display = "inline-block"
    }
})

document.getElementById("addFeildBtn").addEventListener("click", (e) => {
    let entry = {}
    let newName = makeid(10)
    document.querySelector(".inputsDiv").style.border = "1px solid black"
    let newFeild = document.createElement(document.querySelector(".elementTag").value.replace("<", "").replace(">", ""))
    newFeild.style.display = "block"
    newFeild.style.margin = "10px"
    newFeild.name = newName
    document.querySelector(".inputsDiv").appendChild(newFeild)

    entry.tag = newFeild.nodeName.toLowerCase()
    if(newFeild.nodeName == "INPUT") {
        newFeild.type = document.querySelector(".inputType").value
        entry.type = newFeild.type
        if(document.querySelector(".label").style.display != "none") {
            let newLabel = document.createElement("label")
            newLabel.textContent = document.querySelector(".label").value
            newLabel.htmlFor = newName
            newFeild.style.display = "inline-block"
            document.querySelector(".inputsDiv").appendChild(newLabel)
            document.querySelector(".inputsDiv").appendChild(document.createElement("br"))
            entry.label = newLabel.textContent
        }
    } else if(newFeild.nodeName == "SELECT") {
        entry.options = []
        for(let i = 0; i < options.length; i++) {
            let newOption = document.createElement("option")
            newOption.textContent = options[i]
            newFeild.appendChild(newOption)
            entry.options.push(options[i])
        }
    }

    feilds.push(entry)
})

document.getElementById("addOptionBtn").addEventListener("click", (e) => {
    options.push(document.getElementById("optionInput").value)
    document.getElementById("optionInput").value = ""
    document.getElementById("optionsDisplay").textContent = "Options: "+JSON.stringify(options)
})

document.getElementById("alternativesAddBtn").addEventListener("click", (e) => {
    alternatives.push(document.getElementById("alternativesInput").value)
    document.getElementById("alternativesInput").value = ""
    document.getElementById("alternativesList").textContent = "Alternatives: "+JSON.stringify(alternatives)
})

document.getElementById("submitAddBtn").addEventListener("click", (e) => {
    let newQuestion = document.getElementById("questionInput").value
    let newAlternatives = alternatives
    let newFeilds = feilds

    document.getElementById("devQuestions").innerHTML += `
        <div>
            <h3>${newQuestion}</h3>
            <p>Alternatives: ${newAlternatives}</p>
        <div>
    `

    fetch(`/api/addQuestion?question=${newQuestion}&alternatives=${JSON.stringify(newAlternatives)}&feilds=${JSON.stringify(newFeilds)}`)

    document.getElementById("cancelAddBtn").click()
})

fetch("/api/getQuestions")
    .then(response => response.json())
    .then(data => {
        for(let i = 0; i < data.length; i++) {
            document.getElementById("devQuestions").innerHTML += `
                <div>
                    <h3>${data[i].question}</h3>
                    <p>Alternatives: ${data[i].alternatives}</p>
                <div>
            `
            
            let newDivId = makeid(10)
            document.getElementById("userQuestions").innerHTML += `
                <div>
                    <h3>${data[i].question}</h3>
                    <div id=${newDivId}></div>
                </div>
            `

            for(let x = 0; x < data[i].feilds.length; x++) {
                let item = data[i].feilds[x]
                newItem = document.createElement(item.tag)
                document.getElementById(newDivId).appendChild(newItem)

                if(item.tag == "input") {
                    newItem.type = item.type
                    newName = makeid(10)
                    newItem.name = newName
                    if(item.type == "radio" || item.type == "checkbox") {
                        let newLabel = document.createElement("label")
                        newLabel.textContent = item.label
                        newLabel.htmlFor = newName
                        newItem.style.display = "inline-block"
                        document.getElementById(newDivId).appendChild(newLabel)
                        document.getElementById(newDivId).appendChild(document.createElement("br"))
                    }
                } else if(item.tag == "select") {
                    newItem.style.marginBottom = "15px"
                    for(let y = 0; y < item.options.length; y++) {
                        let newOption = document.createElement("option")
                        newOption.textContent = item.options[y]
                        newItem.appendChild(newOption)
                    }
                } else if(item.tag == "textarea") {
                    newItem.style.marginBottom = "15px"
                }
            }
        }
    })