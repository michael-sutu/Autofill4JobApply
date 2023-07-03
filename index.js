const express = require("express")
const app = express()

app.listen(3000)
console.log("Listening on http://localhost:3000")

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/index.html")
})

app.get("/script.js", (req, res) => {
    res.sendFile(__dirname+"/script.js")
})

app.get("/style.css", (req, res) => {
    res.sendFile(__dirname+"/style.css")   
})