const discord = require("discord.js")
module.exports = {
    name: "help",
    alias: "holp",
    description: "This is the help command idiot",
    type: "",
    runCommand(args,msg,client,rest){
        let commands = rest.commands
        let categories = rest.categories
        let list = []
        if(args[0]){
            if(args[0].toLowerCase() == 'all'){
                for (let i = 0; i < commands.length; i++) {
                    const command = commands[i];
                    list.push('`'+command.name+'` ')
                }
                let embed = new discord.RichEmbed()
                .setTitle('Help')
                .setDescription('For more information use wb!help [command_name]\n\n'+list.map(x => x))
                .setColor('#d234eb')  
                msg.channel.send(embed)
            }else{
                let category = categories.find(x => x.name.toLowerCase() == args[0].toLowerCase())
                if(!category){
                    let command = commands.find(x => x.name.toLowerCase() == args[0].toLowerCase() || x.alias == args[0].toLowerCase())
                    if(!command){
                        msg.channel.send('No command/category found')
                    }else{
                        let type = ''
                        let alias = ''
                        if(command.type == ''||command.type == 'any'){type == 'dms or guilds'}else{type = command.type}
                        if(command.alias == ''){alias = 'None'}else{alias = command.alias}
                        let embed = new discord.RichEmbed()
                        .setTitle(`Help`)
                        .setDescription(`Name: ${command.name}\nAlias: ${alias}\nDescription: ${command.description}\nCan Be Used In: ${type}`)
                        .setColor('#d234eb') 
                        msg.channel.send(embed)
                    }
                }else{
                    for (let i = 0; i < commands.length; i++) {
                        const command = commands[i];
                        if(command.category.toLowerCase() == args[0].toLowerCase()){
                            list.push('`'+command.name+'` ')
                        }
                    }
                    let embed = new discord.RichEmbed()
                    .setTitle('Help')
                    .setDescription('For more information use wb!help [command_name]\n\n'+list.map(x => x))
                    .setColor('#d234eb')  
                    msg.channel.send(embed)
                }
            }
        }else{
            let embed = new discord.RichEmbed()
            .setTitle('Help')
            .setDescription('Use `wb!help all` or `wb!help [command_name]` for more detail')
            .setColor('#d234eb')
            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];
                embed.addField(category.name,category.desc)
            }
            msg.channel.send(embed)
        }
    }
}