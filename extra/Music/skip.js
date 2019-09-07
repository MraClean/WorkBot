const ytdl = require('ytdl-core')
const discord = require('discord.js')
const deps = require('./ignore')
let queue = require('./play').queue

module.exports = {
    name: "skip",
    alias: "s",
    description: "Skip the audio thats playing",
    type: "guild",
    async runCommand(args, msgObject, client, rest = {}) {
        let serverQueue = queue.get(msgObject.guild.id)
        let vc = msgObject.member.voiceChannel
        if(!vc){
            return msgObject.channel.send('You need to be in a voice channel to do this')
        }else{
            if(!serverQueue){return msgObject.channel.send('Skipped Nothing')}
            if(!serverQueue.dispatcher){return msgObject.channel.send('Nothing seems to be playing')}
            serverQueue.dispatcher.end()
        }
    }
}