const ytdl = require('ytdl-core')
const discord = require('discord.js')
const deps = require('./ignore')
const youtubeApi = require('simple-youtube-api')
console.log(process.env.YoutubeAPiKey)
const youtube = new youtubeApi(process.env.YoutubeAPiKey);

let queue = new Map()

module.exports = {
    name: "play",
    alias: "p",
    description: "Play some audio",
    type: "guild",
    async runCommand(args, msgObject, client, rest = {}) {
        let vc = msgObject.member.voiceChannel
        let url = args.join(" ")

        try{
            let video = await youtubeApi.Video(url)
            url = `https://www.youtube.com/watch?v=${video.id}`
        }catch(err){
            try {
                let videos = await youtube.searchVideos(url,1)
                let video = await youtube.getVideoByID(videos[0].id) 
                url = `https://www.youtube.com/watch?v=${video.id}`
            } catch (error) {
                console.log(error)
                return msgObject.channel.send('No video was found!') 
            }
        }

        let serverQueue = queue.get(msgObject.guild.id)
        if(!vc){
            return msgObject.channel.send('Please join a voice channel')
        }else{
            let perms = vc.memberPermissions(msgObject.guild.me)
            if(perms.has('CONNECT') && perms.has('SPEAK')){
                let song = {
                    name: '',
                    length: 0,
                    author: '',
                    url: '',
                    thumbnail: ''
                }
                await ytdl.getBasicInfo(url).then(info => {
                    song.name = info.title
                    song.length = info.length_seconds
                    song.author = info.author.name
                    song.thumbnail = info.thumbnail_url
                    song.url = url
                })
                if(!serverQueue){
                    let constructor = {
                        textChannel: msgObject.channel,
                        voiceChannel: vc,
                        connection: null,
                        songs: [],
                        playing: true,
                        dispatcher: null
                    }
                    queue.set(msgObject.guild.id,constructor)

                    constructor.songs.push(song)

                    try {
                        let connection = await vc.join()
                        constructor.connection = connection
                        play(msgObject.guild,constructor.songs[0])
                        let embed = new discord.RichEmbed()
                        .setTitle(`Added ${song.name}`)
                        .setDescription(`Author: ${song.author}\nLength: ${song.length} Seconds\nUrl: ${song.url}`)
                        .setThumbnail(song.thumbnail)
                        .setColor('#42f563')
                        msgObject.channel.send(embed)
                    } catch (err) {
                        queue.delete(msgObject.guild.id)
                        console.log(err)
                        return msgObject.channel.send("I couldn't connect to the voice channel") 
                    }      
                }else{
                    serverQueue.songs.push(song)
                    let embed = new discord.RichEmbed()
                    .setTitle(`Added ${song.name}`)
                    .setDescription(`Author: ${song.author}\nLength: ${song.length} Seconds\nUrl: ${song.url}`)
                    .setThumbnail(song.thumbnail)
                    .setColor('#42f563')
                    msgObject.channel.send(embed)
                }         
            }else{
                return msgObject.channel.send("I can't connect/speak")
            }
        }
    },
    queue: queue
}

function play(guild,song) {
    let serverQueue = queue.get(guild.id)
    if(!song){
        serverQueue.textChannel.send('No more songs in queue, leaving channel.')
        serverQueue.voiceChannel.leave()
        queue.delete(guild.id)
        return
    }
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url,{highestaudio:true}))
    serverQueue.dispatcher = dispatcher
    .on('end', () => {
        serverQueue.songs.shift()
        play(guild,serverQueue.songs[0])
    })
    .on('error', (error) => console.log(error))
}