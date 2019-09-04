let discord = require("discord.js")
let models = require("../models/models")
module.exports = {
    name: "viewAsTeam",
    alias: "",
    description: "View a certain task as the team as a whole (aka see work)",
    type: "any",
    runCommand(args,msg,client,rest = {}){
        if(!args[0] || !args[1]){return msg.channel.send("Format wb!viewAsTeam [team_id] [task_id]")}
        models.Team.findOne({
            id:args[0]
        }, (err,user) => {
            if (err){console.error(err)}
            if(!user) {
                let embed = new discord.RichEmbed()
                .setTitle('Task Information')
                .setDescription(`No user found!`)
                msg.channel.send(embed)
            }else{
                let task = team.tasks.find(x => x.id == args[0])
                if(!task){
                    return msg.channel.send("No task found with that id")
                }else{
                    if(!task.work || task.work.length == 0){
                        let embed = new discord.RichEmbed()
                        .setTitle(task.name)
                        .setDescription(task.desc+'\n\n'+'No work added')
                        .setFooter(`Due By: ${task.due}`)
                        msg.channel.send(embed)
                    }else{
                        let work = []
                        for(v=0;v<task.work.length;v++){
                            let Url = task.work[v]
                            work.push(`Url: ${Url}`)
                        }
                        let embed = new discord.RichEmbed()
                        .setTitle(task.name)
                        .setDescription(task.desc+'\n\n'+work)
                        .setFooter(`Due By: ${task.due}`)
                        msg.channel.send(embed)
                    }
                    
                }
            }
        })
    }
}