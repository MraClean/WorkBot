const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const discord = require("discord.js")
const ms = require("./node_modules/ms")

const settings = require('./settings')

let loaded = false

const client = new discord.Client

require("dotenv").config()

client.on('ready',() => {
    loaded = true
})

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

app.get('/stats',(req,res) => {
    if(!loaded){
        res.json({servers:0,users:0,uptime:0})
    }else{
        res.json({
            servers:client.guilds.size,
            users:client.users.size,
            uptime:ms(client.uptime,{long:true})
        })
    }
})

app.listen(settings.Port, () => {
    console.log("Listening to port 5000 or 80!")
    require("./bot")
})

client.login(process.env.token)
module.exports = client
