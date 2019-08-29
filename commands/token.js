let discord = require("discord.js")
let TokenGenerator = require('uuid-token-generator')
let models = require("../models/models")
module.exports = {
    name: "token",
    alias: "apitoken",
    description: "Get your api token to change guilds from REST api.",
    type: "any",
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
                    requests: []
                })
                let embed = new discord.RichEmbed()
                .setTitle('User Token')
                .setDescription(`Sharing this token with anyone will allow them to make changes in guilds that you have permissions to do. \n \n ${token}`)
                msg.author.send(embed)
                msg.channel.send('Token Sent!')
                return newUser.save()
            }else{
                let token = user.token
                
                let embed = new discord.RichEmbed()
                .setTitle('User Token')
                .setDescription(`Sharing this token with anyone will allow them to make changes in guilds that you have permissions to do. \n \n ${token}`)
                msg.author.send(embed)
                msg.channel.send('Token Sent!')
            }
        })
    }
}