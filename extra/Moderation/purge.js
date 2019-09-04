module.exports = {
    name: "purge",
    alias: "",
    description: "Purge messages from a channel",
    type: "guild",
    runCommand(args, msg, client, rest = {}) {
        if(!me.hasPermissions('MANAGE_MESSAGES')){
            return msg.channel.send(`The bot can't do this`)
        }
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
            msg.channel.send(`You do not have manage messages permission!`);
            return;
        }
        if (!args[0]) {
            msg.channel.send(`No arguments given!`);
            return;
        }
        let amount = Number(args[0]);
        if (isNaN(amount)) {
            msg.channel.send(`No valid number given!`);
            return;
        }
        amount = Math.round(amount);
        msg.channel.bulkDelete(amount).catch(err => {
            msg.channel.send(`I can't purge anymore`)
        })
    }
}