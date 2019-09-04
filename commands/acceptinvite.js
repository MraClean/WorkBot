const unirest = require("unirest")
module.exports = {
    name: "accept",
    alias: "acceptinvite",
    description: "Accept an invite from a link",
    type: "",
    runCommand(args,msg,client,rest = {}){
        if(!args[0]){return msg.channel.send("Please put in the token that was you were sent!")}
        unirest
        .post(`${process.env.endpoint}/invite/${args[0]}`)
        .headers({
            Accept: "application/json",
            "Content-Type": "application/json"
          })
        .send({
            user:msg.author.id
        })
        .then(res => {
            msg.channel.send(res.body)
        })
    }
}