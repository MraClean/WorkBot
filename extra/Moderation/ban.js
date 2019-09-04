module.exports = {
    name: "ban",
    alias: "",
    description: "Ban a user from a guild",
    type: "guild",
    runCommand(args, msg, client, rest = {}) {
        let mentionedUser = msg.mentions.users.first();
        let suppiedReason = args.slice(1).join(" ") || "";
        let log = `${msg.author.username}: ${suppiedReason}`;
        let me = msg.guild.me
        if(!me.hasPermissions('BAN_MEMBERS')){
            return msg.channel.send(`The bot can't do this`)
        }
        if (!msg.member.hasPermission("BAN_MEMBERS")) {
            msg.channel.send(`You do not have ban permissions!`);
            return;
        }
        if (!mentionedUser) {
            msg.channel.send("User Not Found!");
            return;
        }
        if (!msg.guild.member(mentionedUser).bannable) {
            msg.channel.send(`I don't have permissions to kick that user!`);
            return;
        }
        msg.guild.member(mentionedUser).ban(log);
        msg.channel.send(`**That user has been banned**`);
    }
}