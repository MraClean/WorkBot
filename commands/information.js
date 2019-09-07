let discord = require("discord.js");
module.exports = {
    name: "info",
    alias: "information",
    description: "Get some information on the bot",
    type: "any",
    runCommand(args,msg,client,rest = {}){
        let info = [
            `Creator: Soviet Issued Idiot#1273`,
            `Servers: ${client.guilds.size}`,
            'Operating System: Ubuntu Server 18.04',
            'Server: Local Poweredge r410',
            'Source Code: [Link](https://github.com/MraClean/WorkBot)',
            'Invite: [Link](https://discordapp.com/oauth2/authorize?client_id=618946966566600754&scope=bot&permissions=3525825)',
            'Library: Discord.Js',
            'Version: 1.1',
            'Extensions Enabled: `' + `${rest.categories.map(x => x.name)}` + '`'
        ];
        let embed = new discord.RichEmbed()
        .setTitle('Information')
            .setDescription(info.map(x => x));
        embed.setColor('#f54842');
        msg.channel.send(embed)
    }
};