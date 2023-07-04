const express = require("express")
const { MongoClient, ServerApiVersion } = require('mongodb')
const app = express()

app.listen(3000)
console.log("Listening on http://localhost:3000")

const url = "mongodb+srv://Autofill4JobApply:O6dNhpuLX77vr8Pj@cluster0.zb3waas.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(url)

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/index.html")
})

app.get("/script.js", (req, res) => {
    res.sendFile(__dirname+"/script.js")
})

app.get("/style.css", (req, res) => {
    res.sendFile(__dirname+"/style.css")   
})

app.get("/api/new", async (req, res) => {
    await client.connect()
	const db = client.db("users")
    await db.collection("people").insertOne({
        "userid": req.query.userid
    })
})

app.get("/api/authPlugin", async (req, res) => {
    await client.connect()
	const db = client.db("users")
	let current = await db.collection("people").findOne({"userid": req.query.userid})
    if(current == null) {
        res.json(null)
    } else {
        res.json(current)
    }
})

app.get("/api/addQuestion", async (req, res) => {
    await client.connect()
	const db = client.db("users")
    await db.collection("questions").insertOne({
        "question": req.query.question,
        "alternatives": JSON.parse(req.query.alternatives),
        "feilds": JSON.parse(req.query.feilds)
    })

    res.json("Done.")
})

app.get("/api/getQuestions", async (req, res) => {
    await client.connect()
	const db = client.db("users")
	let result = await db.collection("questions").find({}).toArray(function (err, result) {
        if(err) {
            console.log(err)
        }
    })
    res.json(result)
})