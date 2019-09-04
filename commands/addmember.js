const discord = require("discord.js")
const models = require("../models/models")
const TokenGenerator = require('uuid-token-generator')
module.exports = {
    name: "addmember",
    alias: "adduser",
    description: "Add a user to a team your in",
    type: "",
    runCommand(args,msg,client,rest){
        models.User.findOne({
            id:msg.author.id
        }, (err,user) => {
            if (err){console.error(err)}
            if(!user) {
                return msg.channel.send("No Teams Found!")
            }else{
                let teams = user.teams
                if(teams.length == 0){
                    let embed = new discord.RichEmbed()
                    .setTitle('Teams')
                    .setDescription('You are in no teams!')
                    return msg.channel.send(embed)
                }
                let names = []
                for (let i = 0; i < teams.length; i++) {
                    const team = teams[i];
                    names.push(`${i+1}. ${team.name}`)
                }
                names = names.map(x => x)
                const filter = m => m.author.id == msg.author.id
                msg.channel.send(`Please select the team you want to add a member to?\n\n${names}`).then(original => {
                    original.channel.awaitMessages(filter,{max:1,time:10000}).then(msgs => {
                        let message = msgs.first()
                        if(message.content.toLowerCase() == "exit"){return original.channel.send("Exited Process")}
                        if(isNaN(Number(message.content))){return original.channel.send("Invalid Number!")}
                        let selected = teams[Number(message.content)-1]
                        if(!selected){return original.channel.send("Invalid Number!")}
                        models.Team.findOne({
                            id:selected.id
                        }, (err,team) => {
                            if (err){console.error(err)}
                            if(!team){
                                return original.channel.send("Team not found...")
                            }else{
                                original.edit("Please type the member id you want to join the team")
                                original.channel.awaitMessages(filter,{max:1,time:10000}).then(msgs => {
                                    let message = msgs.first()
                                    if(message.content.toLowerCase() == "exit"){return original.channel.send("Exited Process")}
                                    if(isNaN(Number(message.content))){return original.channel.send("Invalid Number!")}
                                    let DUser = client.users.find(x => x.id == message)
                                    if(!user){return original.channel.send("Invalid User Id/None Found!")}
                                    models.User.findOne({
                                        id: DUser.id
                                    },(err,user) => {
                                        if(err){console.error(err)}
                                        if(!user){
                                            let tokgen = new TokenGenerator(128,TokenGenerator.BASE16) 
                                            const token = tokgen.generate()
                                            let Invite = {
                                                team:team.id,
                                                token: token,
                                                user: DUser.id
                                            }
                                            tokgen = new TokenGenerator(256,TokenGenerator.BASE71) 
                                            const UserToken = tokgen.generate()
                                            let newUser = new models.User({
                                                id: msg.author.id,
                                                token: UserToken,
                                                teams: [],
                                                tasks:[],
                                                requests:[Invite]
                                            })
                                            let embed = new discord.RichEmbed()
                                            .setTitle("Join Request")
                                            .setDescription(`${msg.author.username} send you a team invite to ${team.name}\n\nTo accept invite use the command wb!acceptinvite ${token}`)
                                            DUser.send(embed).catch(err => msg.channel.send("Couldn't send the invite"))
                                            team.pendingMembers.push(Invite)
                                            newUser.save()
                                            team.save()
                                            original.edit("Member has been given invite link")
                                        }else{
                                            let isTeam = user.teams.find(x => x.id == team.id)
                                            if(!isTeam){
                                                let hasInvite = user.requests.find(x => x.team == team)
                                                if(hasInvite){return original.channel.send("That user has the invite already!")}
                                                const tokgen = new TokenGenerator(128,TokenGenerator.BASE16) 
                                                const token = tokgen.generate()
                                                let Invite = {
                                                    team:team.id,
                                                    token: token,
                                                    user: DUser.id
                                                }
                                                let embed = new discord.RichEmbed()
                                                .setTitle("Join Request")
                                                .setDescription(`${msg.author.username} send you a team invite to ${team.name}\n\nTo accept invite use the command wb!acceptinvite ${token}`)
                                                DUser.send(embed).catch(err => msg.channel.send("Couldn't send the invite"))
                                                team.pendingMembers.push(Invite)
                                                user.requests.push(Invite)
                                                user.save()
                                                team.save()
                                                original.edit("Member has been given invite link")
                                            }else{
                                                original.channel.send("That user is already in that team!")
                                            }   
                                        }
                                    })
                                    team.save()
                                }).catch(() => original.channel.send("Times Up!"))
                            }
                        })
                    }).catch(() => original.channel.send("Times Up!"))
                })
            }
        }) 
    }
}