const express = require("express")
const { MongoClient, ServerApiVersion } = require('mongodb')
const cors = require("cors")
const app = express()

app.use(cors())
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

app.get("/api/new", async (req, res) => { // creates a new user in mongodb once someone gets authenticated
    await client.connect()
	const db = client.db("users")
    await db.collection("people").insertOne({
        "userid": req.query.userid,
        "Info": []
    })
})

app.get("/api/authPlugin", async (req, res) => { // pulls user information
    await client.connect()
	const db = client.db("users")
	let current = await db.collection("people").findOne({"userid": req.query.userid})
    if(current == null) {
        res.json(null)
    } else {
        res.json(current)
    }
})

app.get("/api/addQuestion", async (req, res) => { // adds a question to the database
    await client.connect()
	const db = client.db("users")
    await db.collection("questions").insertOne({
        "question": req.query.question,
        "alternatives": JSON.parse(req.query.alternatives),
        "feilds": JSON.parse(req.query.feilds)
    })

    res.json("Done.")
})

app.get("/api/getQuestions", async (req, res) => { // gets all the questions from the database
    await client.connect()
	const db = client.db("users")
	let result = await db.collection("questions").find({}).toArray(function (err, result) {
        if(err) {
            console.log(err)
        }
    })
    res.json(result)
})

app.get("/api/updateInfo", async (req, res) => { // update and users data for questions
    await client.connect()
	const db = client.db("users")
    await db.collection("people").updateOne({ userid: req.query.userid }, { $set: { Info: JSON.parse(req.query.new) }})
})

app.get("/api/unknown", async (req, res) => { // adds a value to the unknown queries database
    await client.connect()
	const db = client.db("users")
    await db.collection("unknown").insertOne(JSON.parse(req.query.data))
})

app.get("/api/getUnknown", async (req, res) => { // gets all unknown queries from the database
    await client.connect()
	const db = client.db("users")
	let result = await db.collection("unknown").find({}).toArray(function (err, result) {
        if(err) {
            console.log(err)
        }
    })
    res.json(result)
})

app.get("/api/saveResults", async (req, res) => { // saves results from the save button to multiple databases
    await client.connect()
	const db = client.db("users")
    let data = JSON.parse(req.query.data)
    let newInfo = await db.collection("people").findOne({"userid": req.query.userid})
    if(newInfo.Info) {
        newInfo = newInfo.Info
    } else {
        newInfo = []
    }
    for(let i = 0; i < data.length; i++) {
        await db.collection("questions").insertOne({
            "question": data[i].question,
            "alternatives": [],
            "feilds": [{
                "tag": data[i].tag,
                "type": data[i].type
            }]
        })
        newInfo.push({
            "Question": data[i].question,
            "Alternatives": [],
            "Values": [data[i].value]
        })
    }

    await db.collection("people").updateOne({ userid: req.query.userid }, { $set: { Info: newInfo }})
    res.json("Done")
})