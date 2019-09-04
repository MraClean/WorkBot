let discord = require("discord.js")
module.exports = {
    name: "info",
    alias: "information",
    description: "Get some information on the bot",
    type: "any",
    runCommand(args,msg,client,rest = {}){
        let embed = new discord.RichEmbed()
        .setTitle('Information')
        .setDescription(`Owner: Soviet Issued Idiot#1922 \n Other Bots: [Russian Roulette](https://discordbots.org/bot/584905179032190997) \n Servers: ${client.guilds.size} \n Users: ${client.users.size} \n Library: Discord.js \n Api Routes: [Github](https://pastebin.com/raw/CyCz6ANa) \n Server Hosting: Dell Poweredge r410 \n Version: 1.0`)
        embed.setColor('#f54842')
        msg.channel.send(embed)
    }
}