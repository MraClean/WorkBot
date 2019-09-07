const ytdl = require('ytdl-core');
const discord = require('discord.js');
const queue = require('./play').queue;

module.exports = {
    name: "leave",
    alias: "stop",
    description: "Play some audio",
    type: "guild",
    async runCommand(args, msgObject, client, rest = {}) {
        let serverQueue = queue.get(msgObject.guild.id);
        let vc = msgObject.member.voiceChannel;
        if (!vc) {
            return msgObject.channel.send('Please join a voice channel')
        } else {
            if (!serverQueue) {
                return msgObject.channel.send('Stopped Nothing')
            }
            if (!serverQueue.dispatcher) {
                return msgObject.channel.send('Nothing seems to be playing')
            }
            serverQueue.songs = [];
            serverQueue.dispatcher.end()
        }
    }
};