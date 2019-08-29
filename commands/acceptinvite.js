const unirest = require("unirest")
module.exports = {
    name: "acceptinvite",
    alias: "accepti",
    description: "Accept an invite from a link",
    type: "",
    runCommand(args,msg,client,rest = {}){
        if(!args[0]){return msg.channel.send("Please put in the link that was you were sent!")}
        unirest
        .get(args[0])
        .then(res => {
            msg.channel.send("Response: "+res.message)
        })
    }
}