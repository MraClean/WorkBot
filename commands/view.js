let discord = require("discord.js")
let models = require("../models/models")
module.exports = {
    name: "view",
    alias: "viewtask",
    description: "View a certain task",
    type: "any",
    runCommand(args,msg,client,rest = {}){
        if(!args[0]){return msg.channel.send("Please type in an id")}
        models.User.findOne({
            id:msg.author.id
        }, (err,user) => {
            if (err){console.error(err)}
            if(!user) {
                let embed = new discord.RichEmbed()
                .setTitle('Task Information')
                .setDescription(`No user found!`)
                msg.channel.send(embed)
            }else{
                let task = user.tasks.find(x => x.id == args[0])
                if(!task){
                    return msg.channel.send("No task found with that id that you were assigned")
                }else{
                    let embed = new discord.RichEmbed()
                    .setTitle(task.name)
                    .setDescription(task.desc)
                    .setFooter(`Due By: ${task.due}`)
                    msg.channel.send(embed)
                }
            }
        })
    }
}