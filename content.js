console.log("Extension is online.")

function readHTMLData() {
  const html = document.documentElement.outerHTML
  console.log(html)
}

window.addEventListener("load", readHTMLData)