const discord = require('discord.js')
const unirest = require('unirest')

async function fetch(url) {
    unirest
    .get(url)
    .headers({'Accept': 'application/json'})
    .then(function (response) {
        if(response){
            return Promise(response)
        }     
    })
}

module.exports = {
    name: "status",
    alias: "servers",
    description: "Get the status on the bots servers",
    type: "any",
    runCommand(args,msg,client,rest = {}){
        
       fetch('http://167.71.127.15/status').then(res => {
            if(res.enabled == true){
                let embed = new discord.RichEmbed()
                .setTitle('Server Status')
                .setDescription('Main Server: ✅\nBackup Server: ✅\n\nRunning on `main-server`')
                msg.channel.send(embed)  
            }
        }).catch(err => {
           let embed = new discord.RichEmbed()
           .setTitle('Server Status')
           .setDescription('Main Server: ✅\nBackup Server: ❌\n\nRunning on `main-server`')
           msg.channel.send(embed)
       })
    }
}