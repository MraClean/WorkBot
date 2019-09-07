const ytdl = require('ytdl-core')
const discord = require('discord.js')
const deps = require('./ignore')
let queue = require('./play').queue

module.exports = {
    name: "queue",
    alias: "q",
    description: "Get the queue",
    type: "guild",
    async runCommand(args, msgObject, client, rest = {}) {
        let serverQueue = queue.get(msgObject.guild.id)
        if(!serverQueue){return msgObject.channel.send('No queue to find')}
        let list = []
        for (let i = 0; i < serverQueue.songs.length; i++) {
            const song = serverQueue.songs[i];
            list.push(`${i+1}. ${song.name} | ${song.author} | ${song.length} Sec`)
        }
        let embed = new discord.RichEmbed()
        .setTitle('Queue')
        .setDescription(list.map(x => x))
        msgObject.channel.send(embed)
    }
}