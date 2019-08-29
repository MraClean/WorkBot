let models = require("../models/models")
let TokenGenerator = require("uuid-token-generator")
let discord = require("discord.js")
module.exports = {
    name: "createteam",
    alias: "cteam",
    description: "Create a team",
    type: "any",
    runCommand(args,msg,client,rest = {}){
        models.Team.findOne({
            id:msg.author.id
        }, (err,team) => {
            if (err){console.error(err)}
            const filter = m => m.author.id == msg.author.id
            if(!team) {
                let {name,type} = ["",0]
                msg.channel.send("Please Fill This Information Out. \n Say exit at anytime to cancel the team making process. \n You have 10 seconds for each question \n First Question: What is the team name?").then(original =>{
                    msg.channel.awaitMessages(filter,{
                        max:1,
                        time:10000
                    }).then(collected => {
                        let message = collected.first()
                        if(message.content == "exit"){return msg.channel.send("Exited Team Making Process!")}
                        original.edit(`Name: ${message.content} \n Second Question: Team type? \n 1-Public 2-Private`)
                        name = message.content
                        message.delete()
                        msg.channel.awaitMessages(filter,{
                            max:1,
                            time:10000
                        }).then(collected => {
                            let message = collected.first()
                            if(message.content == "exit"){return msg.channel.send("Exited Team Making Process!")}
                            if(Number(message) == 1||Number(message)==2){
                                type = message.content
                                original.edit(`Name: ${name} \nType: ${type} \n Is this good?`)
                                message.delete()
                                msg.channel.awaitMessages(filter,{
                                    max:1,
                                    time:10000
                                }).then(collected => {
                                    let message = collected.first()
                                    if(message.content == "exit"){return msg.channel.send("Exited Team Making Process!")}
                                    if(message.content == "yes" || message.content == "y"){
                                        original.edit(`New Team With Types: \nName: ${name} \nType: ${type} \n`)
                                        message.delete()
                                        const tokgen = new TokenGenerator(256,TokenGenerator.BASE71) 
                                        const token = tokgen.generate()
                                        let newTeam = new models.Team({
                                            id: msg.author.id,
                                            name: name,
                                            token: token,
                                            members: [msg.author.id],
                                            pendingMembers:[],
                                            tasks: [],
                                            type: Number(type)
                                        })
                                        let embed = new discord.RichEmbed()
                                        .setTitle('Team Token')
                                        .setDescription(`Sharing this token with anyone will allow them to make changes in your team. \n \n ${token}`)
                                        msg.author.send(embed).catch(() => msg.channel.send("Make sure you have dm's enabled. I can't dm you your token."))
                                        models.User.findOne({
                                            id:msg.author.id
                                        }, (err,user) => {
                                            if (err){console.error(err)}
                                            if(!user) {
                                                const UserToken = tokgen.generate()
                                                let newUser = new models.User({
                                                    id: msg.author.id,
                                                    token: UserToken,
                                                    teams: [{id: msg.author.id,name: name}],
                                                    tasks:[],
                                                    requests:[]
                                                })
                                                return newUser.save()
                                            }else{
                                                user.teams.push({
                                                    id: msg.author.id,
                                                    name: name
                                                })
                                                user.save()
                                            }
                                        })
                                        return newTeam.save()
                                    }
                                }).catch(() => msg.channel.send("Times Up!"))
                            }
                        }).catch(() => msg.channel.send("Times Up!"))
                    }).catch(() => msg.channel.send("Times Up!"))
                })
            }else{
                return msg.channel.send("Only 1 Team Per Person")
            }
        })
    }
}