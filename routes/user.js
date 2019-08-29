const express = require("express")
const router = express.Router()
const models = require("../models/models")
const discord = require("discord.js")

const client = new discord.Client

router.post("/user/send",(req,res) => {
    let senderId = req.body.id
    let receiverId = req.body.receiver
    let tokenPassed = req.body.token
    let message = req.body.message
    if(!senderId || !receiverId || !tokenPassed){return res.send({response: "INVALID FORM BODY"})}
    let sender = client.users.find(x => x.id == senderId)
    if(!sender){return res.send({response: "INVALID USER ID"})}
    let receiver = client.users.find(x => x.id == receiverId)
    if(!receiver){return res.send({response: "INVALID MEMBER ID"})}
    models.User.findOne({
        UserId:senderId
    }, (err,user) => {
        if (err){console.error(err)}
        if(!user) {
            res.send({response: "INVALID TOKEN"})
        }else{
            let embed = new discord.RichEmbed()
            .setTitle("Direct Message From "+sender.username+" Via Work-bot Api")
            .setDescription(message)
            receiver.send(embed).catch(err => res.send(`Can't Send \n Error: \n ${err.message}`))
            res.status(200).send({response:"200"})
        }
    })
})

router.get("/:token", (req,res) => {
    let token = req.params.token
    models.User.findOne({
        token:token
    }, (err,user) => {
        if (err){console.error(err)}
        if(!user) {
            res.send({response: "NO USER FOUND"})
        }else{
            res.send({user:client.users.find(x => x.id == user.Id)})
        }
    })
})

router.get("/:id", (req,res) => {
    let user = client.users.find(x => x.id == req.params.id)
    if(user){
        return res.status(200).json({
            username: user.username,
            discriminator: user.discriminator,
            tag: user.tag,
            id: user.id,
            created: dateTime({date: user.createdAt})
        })
    }else{
        return res.status(404).send("No User Found!")
    }
})



module.exports = router
client.login(process.env.token2)