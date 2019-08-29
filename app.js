const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const discord = require("discord.js")

const client = new discord.Client

require("dotenv").config()

mongoose.connect("mongodb://localhost/work-bot",{useNewUrlParser:true}, () => {console.log("Mongodb is online!")})

const app = express()

// Routes
const teams = require("./routes/team")
const guilds = require("./routes/guild")
const users = require("./routes/user")

// Middlewares
app.use(bodyParser.json())
app.use('/team',teams)
app.use('/guild',guilds)
app.use('/user',users)

app.listen(5000, () => {
    console.log("Listening to port 5000 or 80!")
    require("./bot")
})
client.login(process.env.token2)
module.exports = client
