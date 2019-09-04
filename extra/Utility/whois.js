const Discord = require('discord.js')
module.exports = {
    name: "whois",
    alias: "userinfo",
    description: "Get information on a user",
    type: "guild",
    runCommand(args, msg, client, rest = {}) {
        let mentions = msg.mentions.members.array();
        if (mentions.length == 0) {
            return msg.channel.send("Please mention somebody!")
        }
        let member = mentions[0]
        let game
        let vc
        let limit
        let status = member.presence.status
        if (member.presence.game) { game = member.presence.game.name } else { game = null }
        if (member.voiceChannel) { vc = member.voiceChannel.name } else { vc = null }
        if (vc == null) { limit = null } else {
            let Join = member.voiceChannel.userLimit
            if (Join == -0) { limit = "Infinite" }
        }
        if (status == "online") { status = "Online" }
        if (status == "offline") { status = "Offline/Invisible" }
        if (status == "idle") { status = "Idle" }
        if (status == "dnd") { status = "Do Not Disturb" }
        let embed = new Discord.RichEmbed()
            .setTitle(`${member.user.username}'s information`)
            .setThumbnail(`${member.user.avatarURL}`)
            .addField("Dates", `Joined Discord: ${member.user.createdAt} \n Joined Server: ${member.joinedAt}`, true)
            .addField("Last Message", `${member.user.lastMessage || "None!"}`, true)
            .addField("Activity", `Status: ${status} \n Game: ${game || "None"}`, true)
            .addField("Connections", `Voice Channel: ${vc || "None/Can't Find"} \n User Limit: ${limit || "None/Can't Find"}`, true)
            .addField("General", `Tag: ${member.user.tag} \n Id: ${member.user.id}`, true)
            .setColor(member.displayHexColor)
        msg.channel.send(embed)
    }
}