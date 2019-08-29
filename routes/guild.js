const express = require("express")
const router = express.Router()
const models = require("../models/models")
const discord = require("discord.js")

const client = new discord.Client

router.get("/:id", (req,res) => {
    let guild = client.guilds.find(x => x.id == req.params.guildId)
    if(guild){
        res.json({
            name: guild.name,
            id: guild.id,
            roles: guild.roles.array(),

        })
    }else{
        res.send("No Guild Found!")
    }
})

router.post("/promote", (req,res) => {
    let userId = req.body.id
    let memberId = req.body.memberId
    let tokenPassed = req.body.token
    let guildId = req.body.guild
    let rank = req.body.rank
    if(!userId || !memberId || !tokenPassed || !guildId){return res.send({response: "INVALID FORM BODY"})}
    let user = client.users.find(x => x.id == userId)
    if(!user){return res.send({response: "INVALID USER ID"})}
    let guild = client.guilds.find(x => x.id == guildId)
    if(!guild){return res.send({response: "INVALID GUILD ID"})}
    if(!guild.members.find(x => x.id == userId)){res.send({response: "USER NOT FOUND IN GUILD!"})}
    let member = guild.members.find(x => x.id == memberId)
    if(!member){return res.send({response: "INVALID MEMBER ID"})}
    let role = guild.roles.find(x => x.id == rank)
    if(!role){return res.send({response: "INVALID ROLE ID"})}
    models.User.findOne({
        UserId:userId
    }, (err,user) => {
        if (err){console.error(err)}
        if(!user) {
            res.send({response: "INVALID TOKEN"})
        }else{
            let token = user.token
            if(tokenPassed == token){
                let currentMember = guild.members.find(x => x.id == userId)
                if(currentMember.hasPermission("MANAGE_ROLES")){
                    if(!guild.me.hasPermission("MANAGE_ROLES")){return res.send({response: "BOT DOESN'T HAVE PERMISSIONS!"}) }
                    if(!member.manageable){return res.send({response: "BOT CAN'T MANAGE MEMBER!!"})}
                    member.addRole(role,`${currentMember.displayName} sent request via api`).catch(err => {
                        console.log(err)
                        res.status(500).send(`Can't update roles | Reason: \n ${err.message}`)
                    }).then(member => {
                        res.send({response: "200"})
                    })
                }else{
                    return res.send({response: "CURRENT USER DOESN'T HAVE PERMISSIONS!"}) 
                }
            }else{
                return res.send({response: "INVALID TOKEN"})
            }
        }
    })
})

router.post("/demote",(req,res) => {
    let userId = req.body.id
    let memberId = req.body.memberId
    let tokenPassed = req.body.token
    let guildId = req.body.guild
    let rank = req.body.rank
    if(!userId || !memberId || !tokenPassed || !guildId){return res.send({response: "INVALID FORM BODY"})}
    let user = client.users.find(x => x.id == userId)
    if(!user){return res.send({response: "INVALID USER ID"})}
    let guild = client.guilds.find(x => x.id == guildId)
    if(!guild){return res.send({response: "INVALID GUILD ID"})}
    if(!guild.members.find(x => x.id == userId)){res.send({response: "USER NOT FOUND IN GUILD!"})}
    let member = guild.members.find(x => x.id == memberId)
    if(!member){return res.send({response: "INVALID MEMBER ID"})}
    let role = guild.roles.find(x => x.id == rank)
    if(!role){return res.send({response: "INVALID ROLE ID"})}
    models.User.findOne({
        UserId:userId
    }, (err,user) => {
        if (err){console.error(err)}
        if(!user) {
            res.send({response: "INVALID TOKEN"})
        }else{
            let token = user.token
            if(tokenPassed == token){
                let currentMember = guild.members.find(x => x.id == userId)
                if(currentMember.hasPermission("MANAGE_ROLES")){
                    if(!guild.me.hasPermission("MANAGE_ROLES")){return res.send({response: "BOT DOESN'T HAVE PERMISSIONS!"}) }
                    if(!member.manageable){return res.send({response: "BOT CAN'T MANAGE MEMBER!!"})}
                    member.removeRole(role,`${currentMember.displayName} sent request via api`).catch(err => {
                        console.log(err)
                        res.status(500).send(`Can't update roles | Reason: \n ${err.message}`)
                    }).then(member => {
                        res.send({response: "200"})
                    })
                }else{
                    return res.send({response: "CURRENT USER DOESN'T HAVE PERMISSIONS!"}) 
                }
            }else{
                return res.send({response: "INVALID TOKEN"})
            }
        }
    })
})

router.post("/ban",(req,res) => {
    let userId = req.body.id
    let memberId = req.body.memberId
    let tokenPassed = req.body.token
    let guildId = req.body.guild
    if(!userId || !memberId || !tokenPassed || !guildId){return res.send({response: "INVALID FORM BODY"})}
    let user = client.users.find(x => x.id == userId)
    if(!user){return res.send({response: "INVALID USER ID"})}
    let guild = client.guilds.find(x => x.id == guildId)
    if(!guild){return res.send({response: "INVALID GUILD ID"})}
    if(!guild.members.find(x => x.id == userId)){res.send({response: "USER NOT FOUND IN GUILD!"})}
    let member = guild.members.find(x => x.id == memberId)
    if(!member){return res.send({response: "INVALID MEMBER ID"})}
    models.User.findOne({
        UserId:userId
    }, (err,user) => {
        if (err){console.error(err)}
        if(!user) {
            res.send({response: "INVALID TOKEN"})
        }else{
            let token = user.token
            if(tokenPassed == token){
                let currentMember = guild.members.find(x => x.id == userId)
                if(currentMember.hasPermission("BAN_MEMBERS")){
                    if(!guild.me.hasPermission("BAN_MEMBERS")){return res.send({response: "BOT DOESN'T HAVE PERMISSIONS!"}) }
                    if(!member.manageable){return res.send({response: "BOT CAN'T MANAGE MEMBER!"})}
                    if(!member.bannable){return res.send({response: "BOT CAN'T BAN MEMBER!"})}
                    member.ban(`${currentMember.displayName} sent request via api`).catch(err => {
                        console.log(err)
                        res.status(500).send(`Can't ban user | Reason: \n ${err.message}`)
                    }).then(member => {
                        res.send({response: "200"})
                    })
                }else{
                    return res.send({response: "CURRENT USER DOESN'T HAVE PERMISSIONS!"}) 
                }
            }else{
                return res.send({response: "INVALID TOKEN"})
            }
        }
    })
})

router.post("/kick",(req,res) => {
    let userId = req.body.id
    let memberId = req.body.memberId
    let tokenPassed = req.body.token
    let guildId = req.body.guild
    if(!userId || !memberId || !tokenPassed || !guildId){return res.send({response: "INVALID FORM BODY"})}
    let user = client.users.find(x => x.id == userId)
    if(!user){return res.send({response: "INVALID USER ID"})}
    let guild = client.guilds.find(x => x.id == guildId)
    if(!guild){return res.send({response: "INVALID GUILD ID"})}
    if(!guild.members.find(x => x.id == userId)){res.send({response: "USER NOT FOUND IN GUILD!"})}
    let member = guild.members.find(x => x.id == memberId)
    if(!member){return res.send({response: "INVALID MEMBER ID"})}
    models.User.findOne({
        UserId:userId
    }, (err,user) => {
        if (err){console.error(err)}
        if(!user) {
            res.send({response: "INVALID TOKEN"})
        }else{
            let token = user.token
            if(tokenPassed == token){
                let currentMember = guild.members.find(x => x.id == userId)
                if(currentMember.hasPermission("KICK_MEMBERS")){
                    if(!guild.me.hasPermission("KICK_MEMBERS")){return res.send({response: "BOT DOESN'T HAVE PERMISSIONS!"}) }
                    if(!member.manageable){return res.send({response: "BOT CAN'T MANAGE MEMBER!"})}
                    if(!member.kickable){return res.send({response: "BOT CAN'T BAN MEMBER!"})}
                    member.kick(`${currentMember.displayName} sent request via api`).catch(err => {
                        console.log(err)
                        res.status(500).send(`Can't kick user | Reason: \n ${err.message}`)
                    }).then(member => {
                        res.send({response: "200"})
                    })
                }else{
                    return res.send({response: "CURRENT USER DOESN'T HAVE PERMISSIONS!"}) 
                }
            }else{
                return res.send({response: "INVALID TOKEN"})
            }
        }
    })
})

module.exports = router
client.login(process.env.token2)
