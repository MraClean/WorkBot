const discord = require("discord.js")
module.exports = {
    name: "help",
    alias: "holp",
    description: "This is the help command idiot",
    type: "",
    runCommand(args,msg,client,rest){
        let commands = rest.commands
        let list = []
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            list.push(`${command.name}`)
        }
        if(args[0]){
            let command = commands.find(x => x.name == args[0].toLowerCase())
            if(!command){
                command = commands.find(x => x.alias == args[0])
                if(!command){
                    return msg.channel.send("No Command Found!")
                }
            }else{
                let embed = new discord.RichEmbed()
                .setTitle("Command Information")
                .setDescription(`Name: ${command.name}\nAlias: ${command.alias}\nDescription: ${command.description}`)
                .setColor("#2bc455")
                msg.channel.send(embed)
            }
        }else{
            let embed = new discord.RichEmbed()
            .setTitle("Help")
            .setDescription(list.map(x => x))
            .setColor("#2bc455")
            msg.channel.send(embed)
        }
    }
}