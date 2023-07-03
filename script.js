let navButtons = document.querySelector(".sidenav").children
for(let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", (e) => {
        button = e.target
        if(button.className != "selected") {
            document.querySelector(`.${document.querySelector(".selected").textContent.toLowerCase()}Div`).style.display = "none"
            document.querySelector(".selected").className = ""
            button.className = "selected"
            document.querySelector(`.${button.textContent.toLowerCase()}Div`).style.display = "block"
        }
    })
}