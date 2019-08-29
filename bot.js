const discord = require("discord.js")
const mongoose = require("mongoose")
const fs = require("fs")

const client = new discord.Client

const commandList = []

require("dotenv").config()

mongoose.connect(`mongodb://localhost/work-bot`,{useNewUrlParser: true}, () => {console.log('Connected To Database')})

client.on('ready', () => {
    console.log('Bot Online For Api Keys')
})

client.on('message', (msg) => {
    if(!msg.content.startsWith("wb!")){return}
    if(!msg.author){return}
    if(msg.author.id == client.user.id){return}
    if(msg.author.bot){return}
    handleCommand(msg)
})

let commands = fs.readdirSync(__dirname+'/commands')
for (let i = 0; i < commands.length; i++) {
    const file = commands[i];
    let command = require("./commands/"+file)
    if(!command.name || command.name == ""){
        console.log("Command without name sent!")
    }else{
        commandList.push({name: command.name,alias: command.alias, description: command.description, run: command.runCommand,type: command.type})
    }
}

function handleCommand(msg) {
    let command = msg.content.split(" ")[0].replace("wb!", "");
    let args = msg.content.split(" ").slice(1);
    
    command = String(command).toLowerCase()
    
    for (let i = 0; i < commandList.length; i++) {
        const commandObject = commandList[i];
        if(commandObject.alias == ""){
            if(command === commandObject.name) {
                if(commandObject.type == "guild" && !msg.channel.type === "dm"){
                    commandObject.run(args,msg,client,{commands: commandList})
                    return
                }
                if(commandObject.type == "dm" ||  commandObject.type == "group" && !msg.channel.type === "text"){
                    commandObject.run(args,msg,client,{commands: commandList})
                    return
                }
                if(commandObject.type == "any" || commandObject.type == ""){
                    commandObject.run(args,msg,client,{commands: commandList})
                    return
                }
            }
        }else{
            if(command === commandObject.name || command === commandObject.alias) {
                if(commandObject.type == "guild" && !msg.channel.type === "dm"){
                    commandObject.run(args,msg,client,{commands: commandList})
                    return
                }
                if(commandObject.type == "dm" ||  commandObject.type == "group" && !msg.channel.type === "text"){
                    commandObject.run(args,msg,client,{commands: commandList})
                    return
                }
                if(commandObject.type == "any" || commandObject.type == ""){
                    commandObject.run(args,msg,client,{commands: commandList})
                    return
                }
            }
        }

    }
}



client.login(process.env.token2)