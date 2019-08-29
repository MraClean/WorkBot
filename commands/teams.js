let discord = require("discord.js")
let TokenGenerator = require('uuid-token-generator')
let models = require("../models/models")
module.exports = {
    name: "teams",
    alias: "projects",
    description: "Lists the teams you are in",
    type: "",
    runCommand(args,msg,client,rest = {}){
        models.User.findOne({
            id:msg.author.id
        }, (err,user) => {
            if (err){console.error(err)}
            if(!user) {
                const tokgen = new TokenGenerator(256,TokenGenerator.BASE71) 
                const token = tokgen.generate()
                const newUser = new models.User({
                    token: token,
                    id: msg.author.id,
                    teams: [],
                    tasks: [],
                    requests:[]
                })
                let embed = new discord.RichEmbed()
                .setTitle('Teams')
                .setDescription(`No Teams Were Found`)
                msg.channel.send(embed)
                return newUser.save()
            }else{
                let teams = user.teams
                if(teams.length == 0){
                    let embed = new discord.RichEmbed()
                    .setTitle('Teams')
                    .setDescription(`No Teams Were Found`)
                    return msg.channel.send(embed)
                }
                let desc = teams.map(x => x.name)
                let embed = new discord.RichEmbed()
                .setTitle('Teams')
                .setDescription(desc)
                msg.channel.send(embed)
            }
        })
    }
}