let discord = require("discord.js")
let models = require("../models/models")
module.exports = {
    name: "turnIn",
    alias: "complete",
    description: "Turn in stuff for a certain assignment",
    type: "any",
    runCommand(args,msg,client,rest = {}){
        models.User.findOne({
            id:msg.author.id
        }, (err,user) => {
            if (err){console.error(err)}
            if(!user) {
                return msg.channel.send("No Teams Found!")
            }else{
                let tasks = user.tasks
                if(tasks.length == 0){
                    let embed = new discord.RichEmbed()
                    .setTitle('Teams')
                    .setDescription('You are in no teams!')
                    return msg.channel.send(embed)
                }
                let names = []
                for (let i = 0; i < tasks.length; i++) {
                    const task = tasks[i];
                    if(task){
                        names.push(`${i+1}. ${team.name}`)
                    }     
                }
                names = names.map(x => x)
                const filter = m => m.author.id == msg.author.id
                let request = {
                    work: [],
                    id: 0,
                    user: msg.author.id
                }
                msg.channel.send(`Please select the task you want to complete\n\n${names}`).then(original => {
                    original.channel.awaitMessages(filter,{max:1,time:10000}).then(msgs => {
                        let message = msgs.first()
                        if(message.content.toLowerCase() == "exit"){return original.channel.send("Exited Process")}
                        if(isNaN(Number(message.content))){return original.channel.send("Invalid Number!")}
                        let selected = tasks[Number(message.content)-1]
                        request.id = selected.id
                        if(!selected){return original.channel.send("Invalid Number!")}
                        original.edit('Ok, type the url/text of the assignment (files not supported yet)\nSplit up the urls with a |')
                        original.channel.awaitMessages(filter,{max:1,time:10000}).then(msgs => {
                            let message = msgs.first()
                            let urls = message.content.split("|").slice();
                            request.work = urls

                        }).catch(() => original.channel.send("Times Up!"))
                    }).catch(() => original.channel.send("Times Up!"))
                })
            }
        }) 
    }
}