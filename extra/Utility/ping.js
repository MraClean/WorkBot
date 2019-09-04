module.exports = {
    name: "ping",
    alias: "",
    description: "Get the bot ping",
    type: "any",
    runCommand(args, msgObject, client, rest = {}) {
        msgObject.channel.send("Let me pull up my handy book on how to get the ping, hmm so my ping is: Loading...").then(m => {
            let ping = m.createdTimestamp-msgObject.createdTimestamp
            m.edit(`Let me pull up my handy book on how to get the ping, hmm so my ping is ${ping} and the api ping ${Math.round(client.ping)}`)
        })
    }
}