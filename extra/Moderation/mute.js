const ms = require('../deps').ms // Ms doesn't install for ubuntu
module.exports = {
    name: "mute",
    alias: "",
    description: "Mute a member from a guild",
    type: "guild",
    runCommand(args, msg, client, rest = {}) {
        let guild = msg.guild
        let me = guild.me
        let role = guild.roles.find(x => x.name = 'WorkBot-Mute')
        let mentioned = msg.mentions.members.first();
        let time = args[1]
        let reason = args.slice(2).join(" ") || "";

        msg.channel.send('Muting Member').then(msg => msg.delete(5000))
        if(!msg.member.hasPermission("MANAGE_ROLES")){
            return msg.channel.send(`You don't have permissions!`)
        }
        if(!mentioned){
            return msg.channel.send(`Mention somebody!`)
        }
        if(!(me.hasPermission('MANAGE_CHANNELS') && me.hasPermission('MANAGE_ROLES'))){
            return msg.channel.send(`The bot can't do this`)
        }
        if(!role){
            guild.createRole({
                name: 'WorkBot-Mute',
                color: [62, 81, 112]
            }).then(NewRole => {
                for (let i = 0; i < guild.channels.array().length; i++) {
                    const channel = guild.channels.array()[index];
                    channel.overwritePermission(NewRole,{SEND_MESSAGES: false}).then(() => {
                        try {
                            let timeInMs = ms(time)
                            mentioned.addRole(NewRole,reason)
                            msg.channel.send('Muted User')
                            setTimeout(() => {
                                mentioned.removeRole(NewRole,'Times Up!')
                            },timeInMs)
                        } catch (error) {
                            console.log(error)
                            return msg.channel.send('Invalid Time Given!')
                        }
                        
                    })
                }
            })
        }else{
            try {
                let timeInMs = ms(time)
                mentioned.addRole(role,reason)
                msg.channel.send('Muted User')
                setTimeout(() => {
                    mentioned.removeRole(role,'Times Up!')
                },timeInMs)
            } catch (error) {
                console.log(error)
                return msg.channel.send('Invalid Time Given!')
            } 
        }
    }
}