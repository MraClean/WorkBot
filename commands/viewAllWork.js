let discord = require("discord.js")
let models = require("../models/models")
module.exports = {
    name: "viewAllWork",
    alias: "",
    description: "View all work from a team",
    type: "any",
    runCommand(args,msg,client,rest = {}){
        if(!args[0]){return msg.channel.send("Please type in a team id!")}
        models.Team.findOne({
            id:args[0]
        }, (err,team) => {
            if (err){console.error(err)}
            if(!team) {
                let embed = new discord.RichEmbed()
                .setTitle('Task Information')
                .setDescription(`No team found!`)
                msg.channel.send(embed)
            }else{
                let tasks = team.tasks
                if(tasks.length == 0){
                    let embed = new discord.RichEmbed()
                    .setTitle('Tasks')
                    .setDescription(`No Tasks Were Found!`)
                    return msg.channel.send(embed)
                }
                let desc = []
                for(v=0;v<tasks.length;v++){
                    let task = tasks[v]
                    desc.push(`Name: ${task.name} Id: ${task.id}`)
                }
                if(tasks.length == 0){
                    let embed = new discord.RichEmbed()
                    .setTitle('Tasks')
                    .setDescription('None')
                    msg.channel.send(embed)
                }else{
                    let embed = new discord.RichEmbed()
                    .setTitle('Tasks')
                    .setDescription(desc)
                    .setFooter('To view a task use wb!viewAsTeam [task_id]')
                    msg.channel.send(embed)
                } 
            }
        })
    }
}