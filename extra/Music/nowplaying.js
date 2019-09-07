const ytdl = require('ytdl-core')
const discord = require('discord.js')
const deps = require('./ignore')
let queue = require('./play').queue

module.exports = {
    name: "nowplaying",
    alias: "np",
    description: "Get the currently playing song",
    type: "guild",
    async runCommand(args, msgObject, client, rest = {}) {
        let serverQueue = queue.get(msgObject.guild.id)
        if(!serverQueue){return msgObject.channel.send('No song is playing')}
        let song = serverQueue.songs[0]
        let embed = new discord.RichEmbed()
        .setTitle(`Playing ${song.name}`)
        .setDescription(`Author: ${song.author}\nLength: ${song.length} Seconds\nUrl: ${song.url}`)
        .setThumbnail(song.thumbnail)
        .setColor('#42f563')
        msgObject.channel.send(embed)
    }
}